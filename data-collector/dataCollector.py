# -*- coding: utf-8 -*-

import requests
from urllib.request import urlretrieve
#from bs4 import BeautifulSoup
import os
import json
import time

def saveRetaurantsJSON(restaurants):
    with open('restaurants.json', 'w', encoding='utf-8') as f:
        json.dump(restaurants, f, ensure_ascii=False, indent=4)

def saveMealsJSON(meals):
    with open('meals.json', 'w', encoding='utf-8') as f:
        json.dump(meals, f, ensure_ascii=False, indent=4)        
        
def restaurantJson(result):
    #print(result["name"][0]["value"])
    name = result["name"][0]["value"]
    restorantLogo = saveImage(result,"../frontend/src/assets/restaurants","mainimage")
    description = ""
    for descriptions in result["description"]:
        if descriptions['lang']=="sr":
            #print(descriptions["value"])
            description = descriptions["value"]
    mark = 0
    if "rating" in result.keys():
        #print(result["rating"]["score"])
        mark = result["rating"]["score"]/2
    #print(result["address"])
    address = result["address"]
    #rest
    restaurant = dict()
    restaurant["restaurantId"] = i+1
    restaurant["name"] = name
    restaurant["restorantLogo"] = restorantLogo
    restaurant["description"] = description
    restaurant["mark"] = mark
    restaurant["address"] = address
    #print(restaurant)
    return restaurant

def mealJson(result, directory, categories):
    #print(result["name"][0]["value"])
    name = result["name"][0]["value"]
    mealPicture = saveImage(result,directory,"image")
    description = ""
    for descriptions in result["description"]:
        if descriptions['lang']=="en":
            #print(descriptions["value"])
            description = descriptions["value"]
    #print(result["address"])
    category = ""
    for c in categories:
        if result["category"]["$oid"] in c.keys():
            category = c[result["category"]["$oid"]]
            break
    
    price = result["baseprice"]//100
    meal = dict()
    meal["mealId"] = i+1
    meal["name"] = name
    meal["mealPicture"] = mealPicture
    meal["description"] = description
    meal["price"] = price
    meal["category"] = category
    meal["ingredients"] = []
    print(meal)
    return meal

def saveImage(result, location, image_key):
    filename = result["name"][0]["value"].strip().lower().replace(".",'').replace("\\",'').replace("/",'').replace("'",'').replace('"','').replace(" ","_")
    outpath = os.path.join(location, filename+".jpg")
    if not os.path.exists(outpath):
        print("\tCuvam sliku")
        urlretrieve(result[image_key], outpath)
        input("nastavi: ")
    return outpath.split("src/")[1].replace("/",'\\')

location = "lon=20.4598474502563&lat=44.8159717912605"
url = "https://restaurant-api.wolt.com/v3/venues/lists/hot-this-week-venues?"+location
response = requests.get(url)
data = response.json()
print('Most popular restourants keys:',data.keys())
results = data['results']
restaurants = []
meals = []
for i,result in enumerate(results):
    categories = []
    restaurants.append(restaurantJson(result))
    filename = result["name"][0]["value"].strip().lower().replace(" ","_")
    directory = "../frontend/src/assets/meals/{0:s}".format(filename)
    if not os.path.exists(directory):
        os.mkdir(directory)
    result_id = result["active_menu"]['$oid']
    time.sleep(1)
    menus = "https://restaurant-api.wolt.com/v3/menus/{0:s}".format(result_id)
    menu_response = requests.get(menus)
    menus_data = menu_response.json()
    print('Menu keys:',menus_data.keys())
    menu_items = menus_data['results'][0]["items"]
    menu_categories = menus_data['results'][0]['categories']
    for menu_category in menu_categories:
        categories.append({menu_category["id"]["$oid"]:menu_category["name"][0]["value"]})
    meals.append([])
    for menu_item in menu_items:
        #print("\t",menu_item["name"][0]["value"])
        if "image" in menu_item.keys():
            meals[i].append(mealJson(menu_item, directory,categories))
print("\n\nDONE")

"""Nakon sto se naprave json fajlovi izmeniti \\ u / znak"""
saveRetaurantsJSON(restaurants)
saveMealsJSON(meals)