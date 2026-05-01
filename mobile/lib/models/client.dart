class Client {
  final String? id;
  final String name;
  final String cin;
  final String phone;
  final String licenseNumber;
  final bool isSynced;

  Client({
    this.id,
    required this.name,
    required this.cin,
    required this.phone,
    required this.licenseNumber,
    this.isSynced = true,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'cin': cin,
        'phone': phone,
        'license_number': licenseNumber,
        'is_synced': isSynced,
      };

  factory Client.fromJson(Map<String, dynamic> json) => Client(
        id: json['id'] as String?,
        name: json['name'] as String,
        cin: json['cin'] as String,
        phone: json['phone'] as String,
        licenseNumber: json['license_number'] as String,
        isSynced: json['is_synced'] ?? true,
      );
}
