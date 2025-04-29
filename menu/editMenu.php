<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
require '../db.php';

$response = ['success' => false, 'message' => ''];

try {
    // Get the raw POST data
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['idPlat'])) {
        throw new Exception("Missing 'idPlat' parameter");
    }

    $idPlat = $data['idPlat'];
    $nom = $data['nom'];
    $prix = $data['prix'];
    $description = $data['description'];
    $categorie = $data['categorie'];
    $image = $data['image'];

    // Prepare the update statement
    $stmt = $pdo->prepare("UPDATE plat SET nom = ?, prix = ?, description = ?, categorie = ?, image = ? WHERE idPlat = ?");
    $stmt->execute([$nom, $prix, $description, $categorie, $image, $idPlat]);

    if ($stmt->rowCount() > 0) {
        $response['success'] = true;
        http_response_code(200);
    } else {
        throw new Exception("No plat found with the provided idPlat or no changes made");
    }
} catch (Exception $e) {
    http_response_code(400);
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
