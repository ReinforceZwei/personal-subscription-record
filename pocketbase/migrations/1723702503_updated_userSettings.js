/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mjkc42dx5m42jbs")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "copl0um4",
    "name": "fav_currency",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mjkc42dx5m42jbs")

  // remove
  collection.schema.removeField("copl0um4")

  return dao.saveCollection(collection)
})
