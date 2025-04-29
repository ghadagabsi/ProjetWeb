<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require '../db.php';
require '../vendor/autoload.php';

\Cloudinary\Configuration\Configuration::instance([
    'cloud' => [
        'cloud_name' => 'deezublk9', 
        'api_key' => '765448858116222',
        'api_secret' => 'DBoUxKWPb_InWRNcM3c7rU2vcHE'
    ],
    'url' => ['secure' => true]
]);

$response = ['success' => false, 'message' => ''];

try {
    if (!isset($_POST['nom_complet'], $_POST['email'], $_POST['mot_de_passe'], $_POST['role'], $_POST['statut'], $_FILES['image'])) {
        throw new Exception("Missing required fields");
    }

    // Get and sanitize input
    $nom_complet = trim($_POST['nom_complet']);
    $email = trim($_POST['email']);
    $mot_de_passe = hash('sha256', $_POST['mot_de_passe']); // hash password
    $role = trim($_POST['role']);
    $statut = trim($_POST['statut']);
    $image = $_FILES['image'];

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format");
    }

    // Upload image to Cloudinary
    $uploadApi = new \Cloudinary\Api\Upload\UploadApi();
    $result = $uploadApi->upload($image['tmp_name'], [
        'folder' => 'foody/employes',
        'transformation' => [
            'width' => 300,
            'height' => 300,
            'crop' => 'limit'
        ]
    ]);
    $imageUrl = $result['secure_url'];

    // Insert into database
    $stmt = $pdo->prepare("
        INSERT INTO employe 
        (nom_complet, email, mot_de_passe, role, statut, image_employe) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    $success = $stmt->execute([
        $nom_complet,
        $email,
        $mot_de_passe,
        $role,
        $statut,
        $imageUrl
    ]);

    if ($success) {
        $response = [
            'success' => true,
            'message' => 'Employé ajouté avec succès',
            'image_url' => $imageUrl,
            'id' => $pdo->lastInsertId()
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
