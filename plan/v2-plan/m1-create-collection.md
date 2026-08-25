# Create Pocketbase Collection

## Decision to make

### how to create collection

- manually via admin UI
- AI agent generate initial migration code

A: let AI agent generate single initial migration file

### how to handle existing collection

- completely drop existing collection & start from scratch
- rename existing collection & create on top
  - then do we keep v1 schema migration code?

A: rename existing collection if they exist, skip for new instance
   then create v2 schema
   delete v1 schema migration file

## Research: Correct way to write Pocketbase migration

In PocketBase (v0.23+), the recommended way to write Go migrations is using the `migrations.Register` helper and the `core.App` API inside an `init()` block.

---

### 1. Basic Setup & File Placement

1. Place your migration files in your project's migrations directory (e.g. `migrations/1700000000_create_posts.go`).
2. Register the migration using `m.Register(upFunc, downFunc)` inside `init()`.
3. In your `main.go`, register `migratecmd`:
   ```go
   migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
       Automigrate: isDev,
   })
   ```
4. Add blank imports in `main.go` so the migrations are bundled and executed:
   ```go
   import (
       _ "your_project/migrations"
   )
   ```

---

### 2. Creating a Collection Programmatically (Typed Go API)

Create a file like `migrations/1700000000_create_articles.go`:

```go
package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		// 1. Initialize a new collection (NewBaseCollection, NewAuthCollection, or NewViewCollection)
		// Default fields (like 'id') and default collection/field IDs will be auto-assigned.
		collection := core.NewBaseCollection("articles")

		// 2. Configure access rules (nil = superuser only, empty string "" = public)
		collection.ListRule = core.String("@request.auth.id != ''")
		collection.ViewRule = core.String("@request.auth.id != ''")
		collection.CreateRule = core.String("@request.auth.id != ''")
		collection.UpdateRule = core.String("@request.auth.id = author.id")
		collection.DeleteRule = core.String("@request.auth.id = author.id")

		// 3. Add fields
		collection.Fields.Add(
			&core.TextField{
				Name:     "title",
				Required: true,
				Max:      255,
			},
			&core.EditorField{
				Name: "content",
			},
			&core.BoolField{
				Name: "published",
			},
			&core.RelationField{
				Name:          "author",
				Required:      true,
				CollectionId:  "_pb_users_auth_", // or target collection ID
				CascadeDelete: true,
				MaxSelect:     1,
			},
			&core.FileField{
				Name:      "cover",
				MaxSelect: 1,
				MaxSize:   5242880, // 5MB
				MimeTypes: []string{"image/jpeg", "image/png", "image/webp"},
			},
			&core.AutodateField{
				Name:     "created",
				OnCreate: true,
			},
			&core.AutodateField{
				Name:     "updated",
				OnCreate: true,
				OnUpdate: true,
			},
		)

		// 4. (Optional) Add indexes
		collection.AddIndex("idx_articles_author", false, "author", "")

		// 5. Save the collection (validates and creates the SQLite table)
		return app.Save(collection)
	}, func(app core.App) error {
		// Revert action (Down migration)
		collection, err := app.FindCollectionByNameOrId("articles")
		if err != nil {
			return nil // already deleted or doesn't exist
		}

		return app.Delete(collection)
	})
}
```

Relation field requires collection ID. If you don't know the ID, look up the collection using `app.FindCollectionByNameOrId`.

```go
usersCollection, err := app.FindCollectionByNameOrId("users")
if err != nil {
  return err
}

collection.Fields.Add(&core.RelationField{
  Name:         "author",
  CollectionId: usersCollection.Id, // use the retrieved ID
  MaxSelect:    1,
})
```

---

### 3. Modifying an Existing Collection (Adding/Updating Fields)

Create a file like `migrations/1700000001_add_views_field.go`:

```go
package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("articles")
		if err != nil {
			return err
		}

		// Add a new field
		collection.Fields.Add(&core.NumberField{
			Name: "views",
			Min:  core.Float64(0),
		})

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("articles")
		if err != nil {
			return err
		}

		// Remove the field on rollback
		collection.Fields.RemoveByName("views")

		return app.Save(collection)
	})
}
```

---

### 4. Alternative: Importing Collections via JSON Snapshot

If you export collections or use automigrate snapshots:

```go
package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `[
			{
				"name": "posts",
				"type": "base",
				"fields": [
					{ "name": "title", "type": "text", "required": true }
				]
			}
		]`

		// import without deleting missing collections (deleteMissing = false)
		return app.ImportCollectionsByMarshaledJSON([]byte(jsonData), false)
	}, func(app core.App) error {
		return nil
	})
}
```

---

### Key Points to Remember

1. **`app.Save(collection)` vs `app.Delete(collection)`**: Always use `app.Save` and `app.Delete` inside migration callbacks rather than raw SQL, as they properly handle SQLite table schema synchronization, constraints, column migrations, triggers, and index creation.
2. **Auto-generated IDs**: You do not need to supply custom IDs for collections or fields manually. When calling `core.NewBaseCollection("name")` and `collection.Fields.Add(...)`, PocketBase will automatically generate deterministic IDs (via CRC32 checksum) if left empty.
3. **Transaction Safety**: The `app` instance passed into the migration callback is wrapped in an active database transaction. If returning an error, the whole migration step rolls back automatically.