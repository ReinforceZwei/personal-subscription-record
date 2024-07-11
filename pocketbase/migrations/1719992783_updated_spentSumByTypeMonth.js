/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("o7v65u1r0to34ma")

  collection.options = {
    "query": "SELECT \n  `spentRecords`.id,\n  `spentRecords`.type,\n  SUM(`spentRecords`.price) as price,\n  `spentRecords`.created,\n  `spentRecords`.owned_by,\n  strftime(\"%Y\", `spentRecords`.created) as year,\n  strftime(\"%m\", `spentRecords`.created) as month\nFROM `spentRecords`\nGROUP BY \n  strftime(\"%Y\", `spentRecords`.created),\n  strftime(\"%m\", `spentRecords`.created),\n  `spentRecords`.type,\n  `spentRecords`.owned_by"
  }

  // remove
  collection.schema.removeField("bucupqtd")

  // remove
  collection.schema.removeField("ixgtysff")

  // remove
  collection.schema.removeField("v6d2zkwl")

  // remove
  collection.schema.removeField("jhaobxq9")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jmitz9mg",
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
    "id": "yfthrs3o",
    "name": "price",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 1
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4qjozunj",
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
    "id": "gtk0r2n8",
    "name": "year",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 1
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "k0rhlukz",
    "name": "month",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 1
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("o7v65u1r0to34ma")

  collection.options = {
    "query": "SELECT \n  `spentRecords`.id,\n  `spentRecords`.type,\n  SUM(`spentRecords`.price) as price,\n  `spentRecords`.created,\n  `spentRecords`.owned_by,\n  strftime(\"%Y-%m\", `spentRecords`.created) as year_month\nFROM `spentRecords`\nGROUP BY \n  strftime(\"%Y-%m\", `spentRecords`.created),\n  `spentRecords`.type,\n  `spentRecords`.owned_by"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bucupqtd",
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
    "id": "ixgtysff",
    "name": "price",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 1
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "v6d2zkwl",
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
    "id": "jhaobxq9",
    "name": "year_month",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 1
    }
  }))

  // remove
  collection.schema.removeField("jmitz9mg")

  // remove
  collection.schema.removeField("yfthrs3o")

  // remove
  collection.schema.removeField("4qjozunj")

  // remove
  collection.schema.removeField("gtk0r2n8")

  // remove
  collection.schema.removeField("k0rhlukz")

  return dao.saveCollection(collection)
})
