<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require '../db.php';

// Handle OPTIONS request (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$response = ['success' => false, 'message' => ''];

try {
    if (!isset($_GET['idPlat'])) {
        throw new Exception("Missing 'idPlat' parameter");
    }

    $idPlat = trim($_GET['idPlat']);

    // Prepare the delete statement
    $stmt1 = $pdo->prepare("DELETE FROM platingredient WHERE idPlat = :idPlat ");
        $stmt1->execute([
            ':idPlat' => $idPlat,

    ]);
    $stmt = $pdo->prepare("DELETE FROM plat WHERE idPlat = ?");
    $stmt->execute([$idPlat]);

    if ($stmt->rowCount() > 0) {
        
        $response['success'] = true;
        http_response_code(200);
    } else {
        throw new Exception("No plat found with the provided idPlat");
    }
} catch (Exception $e) {
    http_response_code(400);
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
