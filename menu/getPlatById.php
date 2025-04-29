<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require '../db.php';

$response = ['success' => false, 'data' => [], 'message' => ''];

try {
    if (!isset($_GET['idPlat'])) {
        throw new Exception("Missing 'idPlat' parameter");
    }

    $idPlat = trim($_GET['idPlat']);

    // Prepare SQL statement
    $stmt = $pdo->prepare("SELECT * FROM plat WHERE idPlat = ?");
    $stmt->execute([$idPlat]);
    
    // Fetch the plat data
    $plat = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($plat) {
        $response['success'] = true;
        $response['data'] = $plat;
        http_response_code(200);
    } else {
        throw new Exception("Plat not found");
    }
} catch (Exception $e) {
    http_response_code(400);
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
