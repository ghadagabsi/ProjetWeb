<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require '../db.php'; // Adjust path to your db connection

$response = ['success' => false, 'data' => [], 'message' => ''];

try {
    $stmt = $pdo->prepare("SELECT * FROM employe WHERE statut = 'accepte' ORDER BY date_creation DESC");
    $stmt->execute();
    $employes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response['success'] = true;
    $response['data'] = $employes;
} catch (Exception $e) {
    http_response_code(500);
    $response['message'] = 'Failed to fetch accepted employees: ' . $e->getMessage();
}

echo json_encode($response);
?>
