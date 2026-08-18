package main

import (
	"fmt"
	"log"
	"mime"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/hook"
	"github.com/pocketbase/pocketbase/tools/osutils"

	"github.com/ReinforceZwei/personal-subscription-record/server/config"
	"github.com/ReinforceZwei/personal-subscription-record/server/hooks"
	_ "github.com/ReinforceZwei/personal-subscription-record/server/migrations"
	"github.com/ReinforceZwei/personal-subscription-record/server/routes"
)

func init() {
	// Register .webmanifest MIME type so the static file server returns
	// application/manifest+json instead of text/plain.
	mime.AddExtensionType(".webmanifest", "application/manifest+json")
}

var (
	version = "dev"
	commit  = "unknown"
	date    = "unknown"
)

func main() {
	isGoRun := osutils.IsProbablyGoRun()
	_ = godotenv.Load()
	cfg := config.Load()

	app := pocketbase.New()

	app.RootCmd.Version = fmt.Sprintf("%s (commit: %s, built: %s)", version, commit, date)
	app.RootCmd.SetVersionTemplate("{{.Name}} version {{.Version}}\n")

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// Only auto migrate when running from go run
		Automigrate: isGoRun,
	})

	usersHooks := hooks.NewUsersHooks(cfg.DisableRegister)
	usersHooks.Register(app)

	versionRoutes := routes.NewVersionRoutes(version, commit, date)

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		log.Printf("personal-subscription-record server version %s (commit %s, built %s)\n", version, commit, date)
		versionRoutes.Register(se)
		return se.Next()
	})

	// Serve static files from pb_public (replicates the behaviour of the
	// official PocketBase binary, which ships this handler at priority 999).
	app.OnServe().Bind(&hook.Handler[*core.ServeEvent]{
		Func: func(e *core.ServeEvent) error {
			if !e.Router.HasRoute(http.MethodGet, "/{path...}") {
				e.Router.GET("/{path...}", apis.Static(os.DirFS("./pb_public"), true))
			}
			return e.Next()
		},
		Priority: 999,
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
