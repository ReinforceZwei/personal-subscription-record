/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "96j7hkzrt7gi3w5",
    "created": "2024-07-24 02:54:30.869Z",
    "updated": "2024-07-24 02:54:30.869Z",
    "name": "currencyRate",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "iaml6lwq",
        "name": "base",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "hpofhqmh",
        "name": "rates",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      },
      {
        "system": false,
        "id": "uxdd383i",
        "name": "source",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.id != ''",
    "viewRule": "@request.auth.id != ''",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("96j7hkzrt7gi3w5");

  return dao.deleteCollection(collection);
})
