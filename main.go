package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	// Dossier racine des fichiers du site (index.html, styles.css, script.js)
	rootDir := "."

	fileServer := http.FileServer(http.Dir(rootDir))

	// Handler principal : sert index.html sur "/" et laisse le FileServer gérer le reste
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Si on demande autre chose que la racine, on laisse le FileServer répondre
		if r.URL.Path != "/" {
			fileServer.ServeHTTP(w, r)
			return
		}

		indexPath := filepath.Join(rootDir, "index.html")
		if _, err := os.Stat(indexPath); err != nil {
			http.Error(w, "index.html introuvable", http.StatusInternalServerError)
			return
		}

		http.ServeFile(w, r, indexPath)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Serveur PASLUMI démarré sur http://localhost:%s\n", port)
	log.Printf("Appuyez sur CTRL + C pour arrêter le serveur")

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Erreur serveur: %v", err)
	}
}
