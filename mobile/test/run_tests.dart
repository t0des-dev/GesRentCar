import 'dart:io';
import '../lib/services/ocr_service.dart';
import '../lib/services/sync_service.dart';
import '../lib/models/client.dart';

// Mocking test runner for environment without Flutter CLI
void main() async {
  print("Running mobile tests...");

  // Test 1: OCR Extraction
  final ocrService = OcrService();
  final dummyFile = File('dummy.jpg');
  dummyFile.writeAsStringSync('fake_image_data');
  
  final resultCin = await ocrService.scanDocument(dummyFile, 'cin');
  assert(resultCin.isSuccess == true);
  assert(resultCin.documentNumber == 'AB123456');
  print("✓ OCR CIN test passed.");

  // Test 2: Offline Sync Queue
  final syncService = SyncService();
  final client = Client(name: "Test", cin: "AA11", phone: "06000", licenseNumber: "111");
  
  await syncService.saveOfflineClient(client);
  assert(syncService.localQueue.length == 1);
  assert(syncService.localQueue.first.isSynced == false);
  print("✓ Offline save test passed.");

  // Test 3: Sync Success
  int synced = await syncService.syncData();
  assert(synced == 1);
  assert(syncService.localQueue.isEmpty);
  print("✓ Online sync test passed.");

  // Test 4: Conflict Resolution
  final conflictClient = Client(name: "Bad", cin: "CONFLICT_CIN", phone: "123", licenseNumber: "123");
  await syncService.saveOfflineClient(conflictClient);
  int syncedConflict = await syncService.syncData();
  assert(syncedConflict == 0); // Fails to sync due to exception
  assert(syncService.localQueue.length == 1); // Remains in queue
  print("✓ Sync conflict resolution test passed.");
  
  dummyFile.deleteSync();
}
