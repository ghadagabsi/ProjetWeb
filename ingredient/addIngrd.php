<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
// create_ingredient.php
require '../db.php';

// Get the POST data
$nomIngredient = $_POST['nomIngredient'];
$idPlat = $_POST['idPlat']; // Assuming you're also passing the plat ID

try {
    // Begin transaction
    $pdo->beginTransaction();

    // Check if ingredient exists
    $stmt = $pdo->prepare("SELECT idIngredient FROM Ingredient WHERE nomIngredient = ?");
    $stmt->execute([$nomIngredient]);
    $ingredient = $stmt->fetch();

    if (!$ingredient) {
        // Ingredient doesn't exist, insert it
        $stmt = $pdo->prepare("INSERT INTO Ingredient (nomIngredient) VALUES (?)");
        $stmt->execute([$nomIngredient]);
        $idIngredient = $pdo->lastInsertId();
    } else {
        // Ingredient exists, get its ID
        $idIngredient = $ingredient['idIngredient'];
    }

    // Insert into PlatIngredient (check if relationship doesn't already exist)
    $stmt = $pdo->prepare("INSERT IGNORE INTO PlatIngredient (idPlat, idIngredient) VALUES (?, ?)");
    $stmt->execute([$idPlat, $idIngredient]);

    // Commit transaction
    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Ingrédient ajouté avec succès',
        'idIngredient' => $idIngredient
    ]);
} catch (Exception $e) {
    // Rollback transaction on error
    $pdo->rollBack();
    
    echo json_encode([
        'success' => false,
        'message' => 'Erreur: ' . $e->getMessage()
    ]);
}
?>