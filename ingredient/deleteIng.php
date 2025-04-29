<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS"); // Ajouté pour mieux supporter les requêtes DELETE
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Inclusion sécurisée de la connexion DB
require_once __DIR__ . '/../db.php'; // Connexion à la base de données

// Autoriser les pré-requêtes (CORS Preflight pour DELETE)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Valider la méthode HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

// Récupération sécurisée des paramètres
$idPlat = isset($_GET['idPlat']) ? (int)$_GET['idPlat'] : null;
$idIngredient = isset($_GET['idIngredient']) ? (int)$_GET['idIngredient'] : null;

if (!$idPlat || !$idIngredient) {
    http_response_code(400);
    echo json_encode(['error' => 'IDs manquants ou invalides']);
    exit;
}

try {
    // Requête préparée pour éviter les injections SQL
    $stmt = $pdo->prepare("DELETE FROM platingredient WHERE idPlat = :idPlat AND idIngredient = :idIngredient");
    $stmt->execute([
        ':idPlat' => $idPlat,
        ':idIngredient' => $idIngredient
    ]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Aucun ingrédient trouvé pour suppression']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de base de données: ' . $e->getMessage()]);
}
?>
