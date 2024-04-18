/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const snapshot = [
    {
      "id": "_pb_users_auth_",
      "created": "2024-02-15 08:58:24.387Z",
      "updated": "2024-02-15 08:58:24.389Z",
      "name": "users",
      "type": "auth",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "users_name",
          "name": "name",
          "type": "text",
          "required": false,
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
          "id": "users_avatar",
          "name": "avatar",
          "type": "file",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "mimeTypes": [
              "image/jpeg",
              "image/png",
              "image/svg+xml",
              "image/gif",
              "image/webp"
            ],
            "thumbs": null,
            "maxSelect": 1,
            "maxSize": 5242880,
            "protected": false
          }
        }
      ],
      "indexes": [],
      "listRule": "id = @request.auth.id",
      "viewRule": "id = @request.auth.id",
      "createRule": "",
      "updateRule": "id = @request.auth.id",
      "deleteRule": "id = @request.auth.id",
      "options": {
        "allowEmailAuth": true,
        "allowOAuth2Auth": true,
        "allowUsernameAuth": true,
        "exceptEmailDomains": null,
        "manageRule": null,
        "minPasswordLength": 8,
        "onlyEmailDomains": null,
        "onlyVerified": false,
        "requireEmail": false
      }
    },
    {
      "id": "ol8jmxfoktlxfoi",
      "created": "2024-02-15 09:03:27.979Z",
      "updated": "2024-03-28 01:53:52.023Z",
      "name": "spentTypes",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "li8dlemb",
          "name": "name",
          "type": "text",
          "required": true,
          "presentable": true,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "tpul6006",
          "name": "owned_by",
          "type": "relation",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": false,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "p53mm2uo",
          "name": "color",
          "type": "text",
          "required": false,
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
          "id": "ouvd7ui4",
          "name": "icon",
          "type": "text",
          "required": false,
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
          "id": "4m93mqfr",
          "name": "enabled",
          "type": "bool",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {}
        },
        {
          "system": false,
          "id": "gzubqntj",
          "name": "weight",
          "type": "number",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "noDecimal": true
          }
        },
        {
          "system": false,
          "id": "63kzbsfm",
          "name": "budget_per_month",
          "type": "number",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": 0,
            "max": null,
            "noDecimal": false
          }
        }
      ],
      "indexes": [
        "CREATE INDEX `idx_9N1wvVo` ON `spentTypes` (`name`)"
      ],
      "listRule": "@request.auth.id = owned_by.id",
      "viewRule": "@request.auth.id = owned_by.id",
      "createRule": "@request.auth.id = owned_by.id",
      "updateRule": "@request.auth.id = owned_by.id",
      "deleteRule": "@request.auth.id = owned_by.id",
      "options": {}
    },
    {
      "id": "7xgml8atau5keas",
      "created": "2024-03-04 12:37:21.547Z",
      "updated": "2024-03-21 03:37:46.385Z",
      "name": "spentRecords",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "0faa33kp",
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
        },
        {
          "system": false,
          "id": "jeatmg5g",
          "name": "description",
          "type": "text",
          "required": false,
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
          "id": "kxbci3a5",
          "name": "price",
          "type": "number",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "noDecimal": false
          }
        },
        {
          "system": false,
          "id": "ctoj23g9",
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
        },
        {
          "system": false,
          "id": "artevph4",
          "name": "payment",
          "type": "relation",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "collectionId": "ibobfj31kqddblm",
            "cascadeDelete": false,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "bk9npg7a",
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
        }
      ],
      "indexes": [],
      "listRule": "@request.auth.id = owned_by.id",
      "viewRule": "@request.auth.id = owned_by.id",
      "createRule": "@request.auth.id = owned_by.id",
      "updateRule": "@request.auth.id = owned_by.id",
      "deleteRule": "@request.auth.id = owned_by.id",
      "options": {}
    },
    {
      "id": "ibobfj31kqddblm",
      "created": "2024-03-04 12:39:15.119Z",
      "updated": "2024-03-22 06:42:11.615Z",
      "name": "paymentMethods",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "x65zjksz",
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
        },
        {
          "system": false,
          "id": "4n1xyrg1",
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
        },
        {
          "system": false,
          "id": "j5jqliky",
          "name": "color",
          "type": "text",
          "required": false,
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
          "id": "issrkbys",
          "name": "icon",
          "type": "text",
          "required": false,
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
          "id": "19nmz0xa",
          "name": "enabled",
          "type": "bool",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {}
        },
        {
          "system": false,
          "id": "uqyjf1ix",
          "name": "weight",
          "type": "number",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "noDecimal": true
          }
        }
      ],
      "indexes": [],
      "listRule": "@request.auth.id = owned_by.id",
      "viewRule": "@request.auth.id = owned_by.id",
      "createRule": "@request.auth.id = owned_by.id",
      "updateRule": "@request.auth.id = owned_by.id",
      "deleteRule": "@request.auth.id = owned_by.id",
      "options": {}
    },
    {
      "id": "8vjegk6pn49itwr",
      "created": "2024-03-04 12:46:01.695Z",
      "updated": "2024-03-06 08:12:00.539Z",
      "name": "subscriptionPlans",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "cku7fhyb",
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
        },
        {
          "system": false,
          "id": "r2lwv84r",
          "name": "description",
          "type": "text",
          "required": false,
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
          "id": "lvuxo02i",
          "name": "price",
          "type": "number",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "noDecimal": false
          }
        },
        {
          "system": false,
          "id": "b0rjy53s",
          "name": "renew_period_month",
          "type": "number",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "noDecimal": false
          }
        },
        {
          "system": false,
          "id": "pdzvqljw",
          "name": "active",
          "type": "bool",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {}
        },
        {
          "system": false,
          "id": "qvuflxx2",
          "name": "start_date",
          "type": "date",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": "",
            "max": ""
          }
        },
        {
          "system": false,
          "id": "6hu4byex",
          "name": "end_date",
          "type": "date",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": "",
            "max": ""
          }
        },
        {
          "system": false,
          "id": "7qqlpbd2",
          "name": "owned_by",
          "type": "relation",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": false,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "rzzgve1o",
          "name": "payment",
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
        }
      ],
      "indexes": [],
      "listRule": "@request.auth.id = owned_by.id",
      "viewRule": "@request.auth.id = owned_by.id",
      "createRule": "@request.auth.id = owned_by.id",
      "updateRule": "@request.auth.id = owned_by.id",
      "deleteRule": "@request.auth.id = owned_by.id",
      "options": {}
    },
    {
      "id": "1w104vsuehwda8c",
      "created": "2024-03-04 12:50:30.088Z",
      "updated": "2024-04-09 07:20:52.057Z",
      "name": "spentPresets",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "3fv9f4b6",
          "name": "name",
          "type": "text",
          "required": false,
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
          "id": "grdsi9ei",
          "name": "description",
          "type": "text",
          "required": false,
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
          "id": "osxorfpi",
          "name": "price",
          "type": "number",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "noDecimal": false
          }
        },
        {
          "system": false,
          "id": "g1v0fgk4",
          "name": "payment",
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
        },
        {
          "system": false,
          "id": "vbmarmgk",
          "name": "type",
          "type": "relation",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "collectionId": "ol8jmxfoktlxfoi",
            "cascadeDelete": false,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "wrgtiqtp",
          "name": "weight",
          "type": "number",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "noDecimal": true
          }
        },
        {
          "system": false,
          "id": "gvzgs4ri",
          "name": "owned_by",
          "type": "relation",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": false,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": null
          }
        }
      ],
      "indexes": [],
      "listRule": "@request.auth.id = owned_by.id",
      "viewRule": "@request.auth.id = owned_by.id",
      "createRule": "@request.auth.id = owned_by.id",
      "updateRule": "@request.auth.id = owned_by.id",
      "deleteRule": "@request.auth.id = owned_by.id",
      "options": {}
    },
    {
      "id": "2z219we22ccpqxh",
      "created": "2024-03-08 08:10:44.099Z",
      "updated": "2024-03-17 08:42:12.001Z",
      "name": "spentRecordNames",
      "type": "view",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "dakxjzs3",
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
        },
        {
          "system": false,
          "id": "8rp2oljo",
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
        },
        {
          "system": false,
          "id": "ph0z61de",
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
        }
      ],
      "indexes": [],
      "listRule": "@request.auth.id = owned_by.id",
      "viewRule": "@request.auth.id = owned_by.id",
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {
        "query": "SELECT `spentRecords`.name, `spentRecords`.type, `spentRecords`.owned_by, `spentRecords`.id\nFROM `spentRecords`\nGROUP BY `spentRecords`.name, `spentRecords`.owned_by, `spentRecords`.type"
      }
    },
    {
      "id": "bbobjhs0dbswd6j",
      "created": "2024-03-15 06:49:25.917Z",
      "updated": "2024-03-17 08:42:12.020Z",
      "name": "spentSumByMonth",
      "type": "view",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "jkegmanu",
          "name": "price",
          "type": "json",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "maxSize": 1
          }
        },
        {
          "system": false,
          "id": "bsjuy2ty",
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
        },
        {
          "system": false,
          "id": "17u4xpgi",
          "name": "year_month",
          "type": "json",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "maxSize": 1
          }
        }
      ],
      "indexes": [],
      "listRule": "@request.auth.id = owned_by.id",
      "viewRule": "@request.auth.id = owned_by.id",
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {
        "query": "SELECT \n  `spentRecords`.id,\n  SUM(`spentRecords`.price) as price,\n  `spentRecords`.created,\n  `spentRecords`.owned_by,\n  strftime(\"%Y-%m\", `spentRecords`.created) as year_month\nFROM `spentRecords`\nGROUP BY strftime(\"%Y-%m\", `spentRecords`.created), `spentRecords`.owned_by"
      }
    },
    {
      "id": "o7v65u1r0to34ma",
      "created": "2024-03-17 08:04:12.448Z",
      "updated": "2024-03-17 08:42:12.024Z",
      "name": "spentSumByTypeMonth",
      "type": "view",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "jbtto6ty",
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
        },
        {
          "system": false,
          "id": "p58v95pl",
          "name": "price",
          "type": "json",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "maxSize": 1
          }
        },
        {
          "system": false,
          "id": "f260unyg",
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
        },
        {
          "system": false,
          "id": "mu7awpwk",
          "name": "year_month",
          "type": "json",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "maxSize": 1
          }
        }
      ],
      "indexes": [],
      "listRule": "@request.auth.id = owned_by.id",
      "viewRule": "@request.auth.id = owned_by.id",
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {
        "query": "SELECT \n  `spentRecords`.id,\n  `spentRecords`.type,\n  SUM(`spentRecords`.price) as price,\n  `spentRecords`.created,\n  `spentRecords`.owned_by,\n  strftime(\"%Y-%m\", `spentRecords`.created) as year_month\nFROM `spentRecords`\nGROUP BY \n  strftime(\"%Y-%m\", `spentRecords`.created),\n  `spentRecords`.type,\n  `spentRecords`.owned_by"
      }
    },
    {
      "id": "3zqm9emv5sobmye",
      "created": "2024-03-18 13:46:55.496Z",
      "updated": "2024-03-18 13:47:07.866Z",
      "name": "test",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "af6ycmug",
          "name": "name",
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
      "listRule": "",
      "viewRule": "",
      "createRule": "",
      "updateRule": "",
      "deleteRule": "",
      "options": {}
    },
    {
      "id": "mjkc42dx5m42jbs",
      "created": "2024-03-21 06:25:31.325Z",
      "updated": "2024-03-28 01:55:12.191Z",
      "name": "userSettings",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "ifac9rfj",
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
        },
        {
          "system": false,
          "id": "nqt4dc8v",
          "name": "default_page",
          "type": "text",
          "required": false,
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
          "id": "27rjpl8j",
          "name": "color_mode",
          "type": "text",
          "required": false,
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
          "id": "6wnxmjyx",
          "name": "budget_per_month",
          "type": "number",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": 0,
            "max": null,
            "noDecimal": false
          }
        }
      ],
      "indexes": [
        "CREATE UNIQUE INDEX `idx_B0WTAzO` ON `userSettings` (`owned_by`)"
      ],
      "listRule": "@request.auth.id = owned_by.id",
      "viewRule": "@request.auth.id = owned_by.id",
      "createRule": "@request.auth.id = owned_by.id",
      "updateRule": "@request.auth.id = owned_by.id",
      "deleteRule": "@request.auth.id = owned_by.id",
      "options": {}
    },
    {
      "id": "1ayox1b66y8jvg5",
      "created": "2024-03-30 14:24:15.668Z",
      "updated": "2024-04-12 03:19:03.519Z",
      "name": "budgetHistory",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "vxorcg7u",
          "name": "budget",
          "type": "number",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": 0,
            "max": null,
            "noDecimal": false
          }
        },
        {
          "system": false,
          "id": "iqpiyzcz",
          "name": "type",
          "type": "text",
          "required": false,
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
          "id": "t9h0pkva",
          "name": "year",
          "type": "number",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "noDecimal": true
          }
        },
        {
          "system": false,
          "id": "9ileole0",
          "name": "month",
          "type": "number",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "noDecimal": true
          }
        },
        {
          "system": false,
          "id": "o2nvmtxo",
          "name": "owned_by",
          "type": "relation",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": false,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": null
          }
        }
      ],
      "indexes": [],
      "listRule": "@request.auth.id = owned_by.id",
      "viewRule": "@request.auth.id = owned_by.id",
      "createRule": "@request.auth.id = owned_by.id",
      "updateRule": "@request.auth.id = owned_by.id",
      "deleteRule": "@request.auth.id = owned_by.id",
      "options": {}
    }
  ];

  const collections = snapshot.map((item) => new Collection(item));

  return Dao(db).importCollections(collections, true, null);
}, (db) => {
  return null;
})
