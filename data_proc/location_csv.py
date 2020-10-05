import pandas as pd
import numpy as np
import h5py
import geopandas as gp
import os
import datetime
import dask
import dask.dataframe as dd
from tqdm import tqdm

def latlon_iter(latdf, londf, valdf, date):
    out_df = pd.concat([latdf, londf, valdf], axis = 1, keys = ['lat', 'lon', 'sst']).stack().reset_index().drop(columns = ['level_0', 'level_1'])
    out_df['date'] = date
    return out_df

def latlon_iter_chlorpar(latdf, londf, valdf1, valdf2, date):
    out_df = pd.concat([latdf, londf, valdf1, valdf2], axis = 1, keys = ['lat', 'lon', 'chlor', 'par']).stack().reset_index().drop(columns = ['level_0', 'level_1'])
    out_df['date'] = date
    return out_df


# @dask.delayed
def get_outdf(h5file):
    ds = h5py.File(h5file, 'r')
    date = datetime.datetime.strptime(ds.attrs['time_coverage_start'].decode("utf-8"), "%Y-%m-%dT%H:%M:%S.%fZ").strftime("%Y-%m-%d") 
    if 'L2_LAC_OC' in h5file:
        #get chlor and par        
        lat_df = pd.DataFrame(ds['navigation_data']['latitude'])
        lon_df = pd.DataFrame(ds['navigation_data']['longitude'])
        chlor_df = pd.DataFrame(ds['geophysical_data']['chlor_a'])
        par_df = pd.DataFrame(ds['geophysical_data']['par']) * 0.002 + 65.5
        chlorpar_out = latlon_iter_chlorpar(lat_df, lon_df, chlor_df, par_df, date)
        chlorpar_ref = chlorpar_out.loc[(chlorpar_out['chlor'] != -32767.0) & (chlorpar_out['par'] > 0)]
        return chlorpar_ref
    elif 'L2.SST.NRT' in h5file:
        sst_df = pd.DataFrame(ds['geophysical_data']['sst'])
        sst_df = sst_df*0.005
        lat_df = pd.DataFrame(ds['navigation_data']['latitude'])
        long_df = pd.DataFrame(ds['navigation_data']['longitude'])
        sst_out = latlon_iter(lat_df, long_df, sst_df, date)
        sst_ref = sst_out.loc[sst_out['sst'] != -163.835]
        return sst_ref

#get filepaths for raw data
data_path = "data/michigan/requested_files/"
data_files = []
for filename in os.listdir(data_path):
    if any(x in filename for x in ['L2_LAC_OC', 'L2.SST.NRT']):
        data_files.append(data_path + filename)

shp_path = "shapefiles/"

location_list_chlorpar = {
    'erie':pd.DataFrame(),
    'michigan':pd.DataFrame(),
}

location_list_sst = {
    'erie':pd.DataFrame(),
    'michigan':pd.DataFrame(),
}

# @dask.delayed
def add_df(location, loc_file, out_df, filename):
    location_df_chlorpar = location_list_chlorpar[location]
    location_df_sst = location_list_sst[location]
    shp = gp.read_file(shp_path + location + '/' + loc_file).geometry[0]
    minLon, minLat, maxLon, maxLat = shp.bounds
    out_df_filtered = out_df.loc[((out_df['lat'] < maxLat) & (out_df['lat'] > minLat)) & ((out_df['lon'] < maxLon) & (out_df['lon'] > minLon))]
    gdf = gp.GeoDataFrame(out_df_filtered, geometry = gp.points_from_xy(out_df_filtered.lon, out_df_filtered.lat))
    clipped = gp.clip(gdf, shp)
    date_df = pd.DataFrame(clipped.drop(columns = 'geometry'))
    # print(filename, location)
    # print(date_df)
    if 'L2_LAC_OC' in filename:
        location_list_chlorpar[location] = location_df_chlorpar.append(date_df)
    else: 
        location_list_sst[location] = location_df_sst.append(date_df)

# @dask.delayed
def to_csv(location_list_chlorpar, location_list_sst):
    for location in location_list_chlorpar.keys():
        loc_df_chlorpar = location_list_chlorpar[location]
        loc_df_sst = location_list_sst[location]
        merged_df = dd.merge(loc_df_chlorpar, loc_df_sst)
        merged_df.to_csv(location+'.csv', index = False)

def f(filenames):
    for filename in tqdm(filenames):
    # for filename in filenames:
        out_df = get_outdf(filename)
        # print(out_df)
        for location in os.listdir(shp_path):
            for loc_file in os.listdir(shp_path + location):
                if loc_file.endswith('.shp'):
                    add_df(location, loc_file, out_df, filename)
                    to_csv(location_list_chlorpar, location_list_sst)
# dask.compute(f(data_files))
f(data_files)

# print(location_list_chlorpar)
# print(location_list_sst)
