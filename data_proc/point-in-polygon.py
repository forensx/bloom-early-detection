import pandas as pd
import numpy as np
import geopandas as gp
import os
import datetime
import dask
import dask.dataframe as dd
from tqdm import tqdm

sst_df = pd.read_csv('sst.csv')
chlor_df = pd.read_csv('chlor_a.csv')

shp_path = '../shapefiles/'

for location in os.listdir(shp_path):
    print(location)
    for loc_file in os.listdir(shp_path + location):
        if loc_file.endswith('.shp'):
            shp = gp.read_file(shp_path + location + '/' + loc_file).geometry[0]
            minLon, minLat, maxLon, maxLat = shp.bounds
            sst_df_filtered = sst_df.loc[((sst_df['lat'] < maxLat) & (sst_df['lat'] > minLat)) & ((sst_df['lon'] < maxLon) & (sst_df['lon'] > minLon))]
            chlor_df_filtered = chlor_df.loc[((chlor_df['lat'] < maxLat) & (chlor_df['lat'] > minLat)) & ((chlor_df['lon'] < maxLon) & (chlor_df['lon'] > minLon))]

            sst_gdf = gp.GeoDataFrame(sst_df_filtered, geometry = gp.points_from_xy(sst_df_filtered.lon, sst_df_filtered.lat))
            print('SST GDF created.')
            chlor_gdf = gp.GeoDataFrame(chlor_df_filtered, geometry = gp.points_from_xy(chlor_df_filtered.lon, chlor_df_filtered.lat))
            print('Chlor GDF created.')

            sst_clipped = gp.clip(sst_gdf, shp)
            print('SST ' + location + ' clipped.')
            chlor_clipped = gp.clip(chlor_gdf, shp)
            print('Chlor ' + location + ' clipped.')

            sst_final = pd.DataFrame(sst_clipped.drop(columns = 'geometry')) 
            chlor_final = pd.DataFrame(chlor_clipped.drop(columns = 'geometry')) 

            sst_final.to_csv(location+'_sst.csv', index = False)
            chlor_final.to_csv(location+'_chlor.csv', index = False)

