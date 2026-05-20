package main

import (
	"fmt"
	"log"
	"net"
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
	})
<<<<<<< HEAD
=======

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Serveur PASLUMI démarré sur http://localhost:%s\n", port)
	log.Printf("Appuyez sur CTRL + C pour arrêter le serveur")
>>>>>>> 940b4ea9f97108b6e7a2fa971a2d1b7b667886d8

	// Try to use PORT env var, otherwise pick a free port in the 8080-8090 range
	envPort := os.Getenv("PORT")
	ports := []string{}
	if envPort != "" {
		ports = append(ports, envPort)
	}
	for p := 8080; p <= 8090; p++ {
		ports = append(ports, fmt.Sprintf("%d", p))
	}

	for _, port := range ports {
		addr := ":" + port
		ln, err := net.Listen("tcp", addr)
		if err != nil {
			continue
		}

		log.Printf("Serveur PASLUMI démarré sur http://localhost:%s\n", port)
		log.Printf("Appuyez sur CTRL + C pour arrêter le serveur")

		if err := http.Serve(ln, nil); err != nil {
			log.Fatalf("Erreur serveur: %v", err)
		}
		return
	}

	log.Fatalf("Aucun port disponible (essayé PORT env et 8080-8090)")
}
