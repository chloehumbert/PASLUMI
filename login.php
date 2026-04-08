<?php
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

    $email = $_POST['email'] ?? '';
    $rawPassword = $_POST['password'] ?? '';

    if (!$email || !$rawPassword) {
        echo "Champs manquants";
        exit;
    }

    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$email]);

    $user = $stmt->fetch();

    if ($user && password_verify($rawPassword, $user['password_hash'])) {
        echo "Connexion réussie";
    } else {
        echo "Email ou mot de passe incorrect";
    }
} catch (PDOException $e) {
    echo "Erreur serveur: " . $e->getMessage();
}
?>