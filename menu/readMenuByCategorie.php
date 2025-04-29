<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require '../db.php';

$response = ['success' => false, 'data' => [], 'message' => ''];

try {
    if (!isset($_GET['categorie'])) {
        throw new Exception("Missing 'categorie' parameter");
    }

    $categorie = trim($_GET['categorie']);

    $stmt = $pdo->prepare("SELECT * FROM plat WHERE categorie = ? ");
    $stmt->execute([$categorie]);
    $plats = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response['success'] = true;
    $response['data'] = $plats;
    http_response_code(200);
} catch (Exception $e) {
    http_response_code(400);
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
