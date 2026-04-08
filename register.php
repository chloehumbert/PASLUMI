<?php
// Connexion base
try {
    $pdo = new PDO(
        "mysql:host=localhost;dbname=paslumi;charset=utf8mb4",
        "root",
        "",
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );

    // Récupérer données du formulaire
    $username = $_POST['username'] ?? '';
    $email = $_POST['email'] ?? '';
    $rawPassword = $_POST['password'] ?? '';

    if (!$username || !$email || !$rawPassword) {
        echo "Champs manquants";
        exit;
    }

    $passwordHash = password_hash($rawPassword, PASSWORD_BCRYPT);

    $sql = "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$username, $email, $passwordHash]);

    echo "Compte créé";
} catch (PDOException $e) {
    // Affiche une erreur simple pour aider au debug côté front.
    echo "Erreur serveur: " . $e->getMessage();
}
?>