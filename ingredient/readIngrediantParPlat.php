<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Autoriser GET aussi !
header('Access-Control-Allow-Headers: Content-Type');

require '../db.php';

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get idPlat safely
$idPlat = null;

// Si c'est GET, lire depuis $_GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['idPlat'])) {
        $idPlat = filter_var($_GET['idPlat'], FILTER_VALIDATE_INT);
    }
}
// Sinon, si c'est POST en JSON ou FORM
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $requestData = [];
    if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
        $requestData = json_decode(file_get_contents('php://input'), true);
    } else {
        $requestData = $_POST;
    }

    if (isset($requestData['idPlat'])) {
        $idPlat = filter_var($requestData['idPlat'], FILTER_VALIDATE_INT);
    }
}

// Vérifier si idPlat est valide
if ($idPlat === false || $idPlat === null || $idPlat <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing or invalid idPlat parameter']);
    exit;
}

try {
    // Préparer et exécuter la requête
    $stmt = $pdo->prepare("
        SELECT i.* 
        FROM Ingredient i
        JOIN platingredient pi ON i.idIngredient = pi.idIngredient
        WHERE pi.idPlat = ?
    ");
    $stmt->execute([$idPlat]);
    
    $ingredients = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($ingredients)) {
        http_response_code(404);
        echo json_encode(['message' => 'No ingredients found for this dish']);
        exit;
    }
    
    echo json_encode($ingredients);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error',
        'details' => $e->getMessage() // enlever 'details' en production
    ]);
}
?>
