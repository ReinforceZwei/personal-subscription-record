/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2z219we22ccpqxh")

  collection.options = {
    "query": "SELECT `spentRecords`.name, `spentRecords`.type, `spentRecords`.owned_by, `spentRecords`.id, COUNT(`spentRecords`.name) AS `count`\nFROM `spentRecords`\nGROUP BY `spentRecords`.name, `spentRecords`.owned_by, `spentRecords`.type"
  }

  // remove
  collection.schema.removeField("rasp3ism")

  // remove
  collection.schema.removeField("xrenojjg")

  // remove
  collection.schema.removeField("bbjnnc7s")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "8wqnvpbz",
    "name": "name",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fxign2lt",
    "name": "type",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "ol8jmxfoktlxfoi",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zcvlqg1q",
    "name": "owned_by",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nkcox7kt",
    "name": "count",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2z219we22ccpqxh")

  collection.options = {
    "query": "SELECT `spentRecords`.name, `spentRecords`.type, `spentRecords`.owned_by, `spentRecords`.id\nFROM `spentRecords`\nGROUP BY `spentRecords`.name, `spentRecords`.owned_by, `spentRecords`.type"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rasp3ism",
    "name": "name",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xrenojjg",
    "name": "type",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "ol8jmxfoktlxfoi",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bbjnnc7s",
    "name": "owned_by",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // remove
  collection.schema.removeField("8wqnvpbz")

  // remove
  collection.schema.removeField("fxign2lt")

  // remove
  collection.schema.removeField("zcvlqg1q")

  // remove
  collection.schema.removeField("nkcox7kt")

  return dao.saveCollection(collection)
})
