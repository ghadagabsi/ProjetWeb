<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require '../db.php';
require '../vendor/autoload.php';

// Configure Cloudinary
\Cloudinary\Configuration\Configuration::instance([
    'cloud' => [
        'cloud_name' => 'deezublk9', 
        'api_key' => '765448858116222',
        'api_secret' => 'DBoUxKWPb_InWRNcM3c7rU2vcHE'
    ],
    'url' => [
        'secure' => true
    ]
]);

$response = ['success' => false, 'message' => ''];

try {
    // Check if all required fields are present
    if (!isset($_POST['nom'], $_POST['prix'], $_POST['categorie'], $_POST['description'], $_FILES['image'])) {
        throw new Exception("Missing required fields");
    }

    // Validate inputs
    $nom = trim($_POST['nom']);
    $prix = floatval($_POST['prix']);
    $categorie = trim($_POST['categorie']);
    $description = trim($_POST['description']);
    $image = $_FILES['image'];

    if (empty($nom) || $prix <= 0 || empty($categorie)|| empty($description)) {
        throw new Exception("Invalid input data");
    }

    // Upload image to Cloudinary
    $uploadApi = new \Cloudinary\Api\Upload\UploadApi();
    $result = $uploadApi->upload($image['tmp_name'], [
        'folder' => 'foody/items',
        'transformation' => [
            'width' => 300,
            'height' => 300,
            'crop' => 'limit'
        ]
    ]);
    $imageUrl = $result['secure_url'];

    // Insert into database
    $stmt = $pdo->prepare("
        INSERT INTO plat 
        (nom, prix, categorie, description, image) 
        VALUES (?, ?, ?, ?, ?)
    ");
    
    $success = $stmt->execute([
        $nom, 
        $prix, 
        $categorie, 
        $description, 
        $imageUrl
    ]);
    $lastInsertId = $pdo->lastInsertId();

   
    if ($success) {
        $response = [
            'success' => true,
            'message' => 'Dish added successfully',
            'image_url' => $imageUrl,
            'id' => $lastInsertId
        ];
        http_response_code(201);
    } else {
        throw new Exception("Failed to insert into database");
    }

} catch (Exception $e) {
    http_response_code(400);
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>