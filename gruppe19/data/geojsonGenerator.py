import json

tsvFilePath = 'OpenScoutMap - Datensatz.tsv'
jsFilePath = 'OpenScoutMapData.js'

data = []
flagHeadlines = 0
counter = 1
with open(tsvFilePath, newline='\n', encoding='utf-8-sig') as tsvFile:
    for line in tsvFile.readlines():
        if flagHeadlines > 1:
            elems = line.split('\t')
            elems[11] = ''.join(filter(str.isalnum, elems[11]))
            
            datapoint = {
                "name" : elems[0],
                "addr": elems[3],
                "postalcode": elems[4],
                "state": elems[5],
                "country": elems[6],
                "desc": elems[7],
                "website": elems[8],
                "imgsrc": elems[9],
                "tag": elems[10],
                "cathegory": elems[11],
                "lat" : elems[1],
                "lng": elems[2],
                "id" : counter,
            }
            geometry = {
                "type": "Point",
                "coordinates": [float(elems[2]), float(elems[1])]
            }
            overhead = {
                "type": "Feature",
                "properties": datapoint,
                "geometry" : geometry
            }
            data.append(overhead)
            counter +=1
        else:
            flagHeadlines += 1

with open(jsFilePath, 'w+') as jsFile:
    jsonString = 'var list_places ='
    jsonString += json.dumps(data, indent=4)
    spcial_char_map = {ord('ä'): '&auml;', ord('ü'): '&Uuml;', ord('ö'): '&ouml;', ord('Ä'): '&Auml;', ord('Ü'): '&Uuml;', ord('Ö'): '&Ouml;', ord('ß'): '&szlig'}
    jsonString = jsonString.translate(spcial_char_map)
    jsonString += ';'
    jsFile.write(jsonString)
