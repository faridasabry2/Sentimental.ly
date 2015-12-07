settings = {
    'APP_ID': '1918180781739655',
    'APP_SECRET': '5a76107345f3aac0ba8083549cae9955',
    'INDICO_API_KEY': '2b0641dfee143ececc9b067b88aa3182',
    'ACCESS_TOKEN': '1918180781739655|5a76107345f3aac0ba8083549cae9955'
}

def get(key):
    for k, v in settings.iteritems():
        if k == key:
            return v