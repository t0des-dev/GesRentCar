import '../models/client.dart';

class SyncService {
  // Mocking Hive Box for local storage
  List<Client> localQueue = [];

  Future<void> saveOfflineClient(Client client) async {
    // Save to Hive locally with isSynced = false
    final offlineClient = Client(
      name: client.name,
      cin: client.cin,
      phone: client.phone,
      licenseNumber: client.licenseNumber,
      isSynced: false,
    );
    localQueue.add(offlineClient);
  }

  Future<int> syncData() async {
    int syncedCount = 0;
    List<Client> toRemove = [];

    for (var client in localQueue) {
      if (!client.isSynced) {
        try {
          // Simulate API call to backend
          await _pushToApi(client);
          toRemove.add(client);
          syncedCount++;
        } catch (e) {
          // Keep in queue if API fails (offline or conflict)
        }
      }
    }

    // Remove successfully synced items from local queue
    for (var client in toRemove) {
      localQueue.remove(client);
    }

    return syncedCount;
  }

  Future<void> _pushToApi(Client client) async {
    // Mock API push. In real life: dio.post('/api/clients')
    await Future.delayed(Duration(milliseconds: 200));
    
    // Simulate API conflict check (e.g., CIN already exists)
    if (client.cin == 'CONFLICT_CIN') {
      throw Exception('Data conflict with server');
    }
  }
}
