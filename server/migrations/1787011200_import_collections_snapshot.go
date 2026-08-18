package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

// This migration is the Go port of the original JavaScript collections
// snapshot (pocketbase/migrations/1744081419_collections_snapshot.js).
//
// It imports only the custom (non-system) collections. The built-in users
// auth collection and the system collections (_superusers, _externalAuths,
// _mfas, _otps, _authOrigins) are created by the PocketBase framework itself
// and are configured in the separate updated_users migration.
//
// The leftover "test" collection from the original snapshot is intentionally
// not migrated - it is unused by the application.
func init() {
	m.Register(func(app core.App) error {
		jsonData := `[
  {
    "createRule": "@request.auth.id = owned_by.id",
    "deleteRule": "@request.auth.id = owned_by.id",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "li8dlemb",
        "max": 0,
        "min": 0,
        "name": "name",
        "pattern": "",
        "presentable": true,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "tpul6006",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "owned_by",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "p53mm2uo",
        "max": 0,
        "min": 0,
        "name": "color",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "ouvd7ui4",
        "max": 0,
        "min": 0,
        "name": "icon",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "4m93mqfr",
        "name": "enabled",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "gzubqntj",
        "max": null,
        "min": null,
        "name": "weight",
        "onlyInt": true,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "63kzbsfm",
        "max": null,
        "min": 0,
        "name": "budget_per_month",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "cascadeDelete": false,
        "collectionId": "ibobfj31kqddblm",
        "hidden": false,
        "id": "ons3phml",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "default_payment",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "ol8jmxfoktlxfoi",
    "indexes": [
      "CREATE INDEX ` + "`" + `idx_9N1wvVo` + "`" + ` ON ` + "`" + `spentTypes` + "`" + ` (` + "`" + `name` + "`" + `)"
    ],
    "listRule": "@request.auth.id = owned_by.id",
    "name": "spentTypes",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.id = owned_by.id",
    "viewRule": "@request.auth.id = owned_by.id"
  },
  {
    "createRule": "@request.auth.id = owned_by.id",
    "deleteRule": "@request.auth.id = owned_by.id",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "0faa33kp",
        "max": 0,
        "min": 0,
        "name": "name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "jeatmg5g",
        "max": 0,
        "min": 0,
        "name": "description",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "kxbci3a5",
        "max": null,
        "min": null,
        "name": "price",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "cascadeDelete": false,
        "collectionId": "ol8jmxfoktlxfoi",
        "hidden": false,
        "id": "ctoj23g9",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "type",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "ibobfj31kqddblm",
        "hidden": false,
        "id": "artevph4",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "payment",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "bk9npg7a",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "owned_by",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "7xgml8atau5keas",
    "indexes": [],
    "listRule": "@request.auth.id = owned_by.id",
    "name": "spentRecords",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.id = owned_by.id",
    "viewRule": "@request.auth.id = owned_by.id"
  },
  {
    "createRule": "@request.auth.id = owned_by.id",
    "deleteRule": "@request.auth.id = owned_by.id",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "x65zjksz",
        "max": 0,
        "min": 0,
        "name": "name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "4n1xyrg1",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "owned_by",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "j5jqliky",
        "max": 0,
        "min": 0,
        "name": "color",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "issrkbys",
        "max": 0,
        "min": 0,
        "name": "icon",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "19nmz0xa",
        "name": "enabled",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "uqyjf1ix",
        "max": null,
        "min": null,
        "name": "weight",
        "onlyInt": true,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "ibobfj31kqddblm",
    "indexes": [],
    "listRule": "@request.auth.id = owned_by.id",
    "name": "paymentMethods",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.id = owned_by.id",
    "viewRule": "@request.auth.id = owned_by.id"
  },
  {
    "createRule": "@request.auth.id = owned_by.id",
    "deleteRule": "@request.auth.id = owned_by.id",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "cku7fhyb",
        "max": 0,
        "min": 0,
        "name": "name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "r2lwv84r",
        "max": 0,
        "min": 0,
        "name": "description",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "lvuxo02i",
        "max": null,
        "min": null,
        "name": "price",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "b0rjy53s",
        "max": null,
        "min": null,
        "name": "renew_period_month",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "pdzvqljw",
        "name": "active",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "qvuflxx2",
        "max": "",
        "min": "",
        "name": "start_date",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "6hu4byex",
        "max": "",
        "min": "",
        "name": "end_date",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "7qqlpbd2",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "owned_by",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "ibobfj31kqddblm",
        "hidden": false,
        "id": "rzzgve1o",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "payment",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "8vjegk6pn49itwr",
    "indexes": [],
    "listRule": "@request.auth.id = owned_by.id",
    "name": "subscriptionPlans",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.id = owned_by.id",
    "viewRule": "@request.auth.id = owned_by.id"
  },
  {
    "createRule": "@request.auth.id = owned_by.id",
    "deleteRule": "@request.auth.id = owned_by.id",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "3fv9f4b6",
        "max": 0,
        "min": 0,
        "name": "name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "grdsi9ei",
        "max": 0,
        "min": 0,
        "name": "description",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "osxorfpi",
        "max": null,
        "min": null,
        "name": "price",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "cascadeDelete": false,
        "collectionId": "ibobfj31kqddblm",
        "hidden": false,
        "id": "g1v0fgk4",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "payment",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "ol8jmxfoktlxfoi",
        "hidden": false,
        "id": "vbmarmgk",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "type",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "wrgtiqtp",
        "max": null,
        "min": null,
        "name": "weight",
        "onlyInt": true,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "gvzgs4ri",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "owned_by",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "1w104vsuehwda8c",
    "indexes": [],
    "listRule": "@request.auth.id = owned_by.id",
    "name": "spentPresets",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.id = owned_by.id",
    "viewRule": "@request.auth.id = owned_by.id"
  },
  {
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_K5gU",
        "max": 0,
        "min": 0,
        "name": "name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "ol8jmxfoktlxfoi",
        "hidden": false,
        "id": "_clone_Yl1C",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "type",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "_clone_PqEG",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "owned_by",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "number2245608546",
        "max": null,
        "min": null,
        "name": "count",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      }
    ],
    "id": "2z219we22ccpqxh",
    "indexes": [],
    "listRule": "@request.auth.id = owned_by.id",
    "name": "spentRecordNames",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT ` + "`" + `spentRecords` + "`" + `.name, ` + "`" + `spentRecords` + "`" + `.type, ` + "`" + `spentRecords` + "`" + `.owned_by, ` + "`" + `spentRecords` + "`" + `.id, COUNT(` + "`" + `spentRecords` + "`" + `.name) AS ` + "`" + `count` + "`" + `\nFROM ` + "`" + `spentRecords` + "`" + `\nGROUP BY ` + "`" + `spentRecords` + "`" + `.name, ` + "`" + `spentRecords` + "`" + `.owned_by, ` + "`" + `spentRecords` + "`" + `.type",
    "viewRule": "@request.auth.id = owned_by.id"
  },
  {
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "json3402113753",
        "maxSize": 1,
        "name": "price",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "_clone_3TQG",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "_clone_w1dI",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "owned_by",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "json769146577",
        "maxSize": 1,
        "name": "year_month",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      }
    ],
    "id": "bbobjhs0dbswd6j",
    "indexes": [],
    "listRule": "@request.auth.id = owned_by.id",
    "name": "spentSumByMonth",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT \n  ` + "`" + `spentRecords` + "`" + `.id,\n  SUM(` + "`" + `spentRecords` + "`" + `.price) as price,\n  ` + "`" + `spentRecords` + "`" + `.created,\n  ` + "`" + `spentRecords` + "`" + `.owned_by,\n  strftime(\"%Y-%m\", ` + "`" + `spentRecords` + "`" + `.created) as year_month\nFROM ` + "`" + `spentRecords` + "`" + `\nGROUP BY strftime(\"%Y-%m\", ` + "`" + `spentRecords` + "`" + `.created), ` + "`" + `spentRecords` + "`" + `.owned_by",
    "viewRule": "@request.auth.id = owned_by.id"
  },
  {
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "ol8jmxfoktlxfoi",
        "hidden": false,
        "id": "_clone_Ga6c",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "type",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "json3402113753",
        "maxSize": 1,
        "name": "price",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "_clone_9CKH",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "_clone_lbRI",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "owned_by",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "json3145888567",
        "maxSize": 1,
        "name": "year",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "number2394296326",
        "max": null,
        "min": null,
        "name": "month",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      }
    ],
    "id": "o7v65u1r0to34ma",
    "indexes": [],
    "listRule": "@request.auth.id = owned_by.id",
    "name": "spentSumByTypeMonth",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT \n  ` + "`" + `spentRecords` + "`" + `.id,\n  ` + "`" + `spentRecords` + "`" + `.type,\n  SUM(` + "`" + `spentRecords` + "`" + `.price) as price,\n  ` + "`" + `spentRecords` + "`" + `.created,\n  ` + "`" + `spentRecords` + "`" + `.owned_by,\n  strftime(\"%Y\", ` + "`" + `spentRecords` + "`" + `.created) as year,\n  CAST(strftime(\"%m\", ` + "`" + `spentRecords` + "`" + `.created) as INT) as month\nFROM ` + "`" + `spentRecords` + "`" + `\nGROUP BY \n  strftime(\"%Y\", ` + "`" + `spentRecords` + "`" + `.created),\n  strftime(\"%m\", ` + "`" + `spentRecords` + "`" + `.created),\n  ` + "`" + `spentRecords` + "`" + `.type,\n  ` + "`" + `spentRecords` + "`" + `.owned_by",
    "viewRule": "@request.auth.id = owned_by.id"
  },
  {
    "createRule": "@request.auth.id = owned_by.id",
    "deleteRule": "@request.auth.id = owned_by.id",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "ifac9rfj",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "owned_by",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "nqt4dc8v",
        "max": 0,
        "min": 0,
        "name": "default_page",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "27rjpl8j",
        "max": 0,
        "min": 0,
        "name": "color_mode",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "6wnxmjyx",
        "max": null,
        "min": 0,
        "name": "budget_per_month",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "copl0um4",
        "maxSize": 2000000,
        "name": "fav_currency",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "mjkc42dx5m42jbs",
    "indexes": [
      "CREATE UNIQUE INDEX ` + "`" + `idx_B0WTAzO` + "`" + ` ON ` + "`" + `userSettings` + "`" + ` (` + "`" + `owned_by` + "`" + `)"
    ],
    "listRule": "@request.auth.id = owned_by.id",
    "name": "userSettings",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.id = owned_by.id",
    "viewRule": "@request.auth.id = owned_by.id"
  },
  {
    "createRule": "@request.auth.id = owned_by.id",
    "deleteRule": "@request.auth.id = owned_by.id",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "vxorcg7u",
        "max": null,
        "min": 0,
        "name": "budget",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "iqpiyzcz",
        "max": 0,
        "min": 0,
        "name": "type",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "t9h0pkva",
        "max": null,
        "min": null,
        "name": "year",
        "onlyInt": true,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "9ileole0",
        "max": null,
        "min": null,
        "name": "month",
        "onlyInt": true,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "o2nvmtxo",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "owned_by",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "1ayox1b66y8jvg5",
    "indexes": [],
    "listRule": "@request.auth.id = owned_by.id",
    "name": "budgetHistory",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.id = owned_by.id",
    "viewRule": "@request.auth.id = owned_by.id"
  }
]`

		return app.ImportCollectionsByMarshaledJSON([]byte(jsonData), false)
	}, func(app core.App) error {
		// Delete in reverse dependency order (views first, referenced collections last).
		for _, name := range []string{
			"spentRecordNames",
			"spentSumByMonth",
			"spentSumByTypeMonth",
			"spentRecords",
			"spentPresets",
			"subscriptionPlans",
			"spentTypes",
			"budgetHistory",
			"userSettings",
			"paymentMethods",
		} {
			collection, err := app.FindCollectionByNameOrId(name)
			if err != nil {
				continue // already deleted
			}
			if err := app.Delete(collection); err != nil {
				return err
			}
		}

		return nil
	})
}
