/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ol8jmxfoktlxfoi")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ons3phml",
    "name": "default_payment",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "ibobfj31kqddblm",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ol8jmxfoktlxfoi")

  // remove
  collection.schema.removeField("ons3phml")

  return dao.saveCollection(collection)
})
