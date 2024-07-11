/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("o7v65u1r0to34ma")

  collection.options = {
    "query": "SELECT \n  `spentRecords`.id,\n  `spentRecords`.type,\n  SUM(`spentRecords`.price) as price,\n  `spentRecords`.created,\n  `spentRecords`.owned_by,\n  strftime(\"%Y\", `spentRecords`.created) as year,\n  CAST(strftime(\"%m\", `spentRecords`.created) as INT) as month\nFROM `spentRecords`\nGROUP BY \n  strftime(\"%Y\", `spentRecords`.created),\n  strftime(\"%m\", `spentRecords`.created),\n  `spentRecords`.type,\n  `spentRecords`.owned_by"
  }

  // remove
  collection.schema.removeField("0oq77syb")

  // remove
  collection.schema.removeField("n5kadpgx")

  // remove
  collection.schema.removeField("r4motd8q")

  // remove
  collection.schema.removeField("lnyevhdv")

  // remove
  collection.schema.removeField("nmqx40fv")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "8g90ttge",
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
    "id": "z8fimevi",
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
    "id": "sx5meumm",
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
    "id": "itbqkflk",
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
    "id": "2a6qmnmd",
    "name": "month",
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
  const collection = dao.findCollectionByNameOrId("o7v65u1r0to34ma")

  collection.options = {
    "query": "SELECT \n  `spentRecords`.id,\n  `spentRecords`.type,\n  SUM(`spentRecords`.price) as price,\n  `spentRecords`.created,\n  `spentRecords`.owned_by,\n  strftime(\"%Y\", `spentRecords`.created) as year,\n  strftime(\"%m\", `spentRecords`.created) as month\nFROM `spentRecords`\nGROUP BY \n  strftime(\"%Y\", `spentRecords`.created),\n  strftime(\"%m\", `spentRecords`.created),\n  `spentRecords`.type,\n  `spentRecords`.owned_by"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0oq77syb",
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
    "id": "n5kadpgx",
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
    "id": "r4motd8q",
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
    "id": "lnyevhdv",
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
    "id": "nmqx40fv",
    "name": "month",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 1
    }
  }))

  // remove
  collection.schema.removeField("8g90ttge")

  // remove
  collection.schema.removeField("z8fimevi")

  // remove
  collection.schema.removeField("sx5meumm")

  // remove
  collection.schema.removeField("itbqkflk")

  // remove
  collection.schema.removeField("2a6qmnmd")

  return dao.saveCollection(collection)
})
