import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../services/ocr_service.dart';

class ScanScreen extends StatefulWidget {
  @override
  _ScanScreenState createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen> {
  final OcrService _ocrService = OcrService();
  final ImagePicker _picker = ImagePicker();
  
  File? _image;
  OcrResult? _result;
  bool _isProcessing = false;

  Future<void> _pickAndScan(String type) async {
    final XFile? photo = await _picker.pickImage(source: ImageSource.camera);
    
    if (photo == null) return;

    setState(() {
      _image = File(photo.path);
      _isProcessing = true;
      _result = null;
    });

    try {
      final result = await _ocrService.scanDocument(_image!, type);
      setState(() {
        _result = result;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur lors du scan: $e')),
      );
    } finally {
      setState(() {
        _isProcessing = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Scanner Documents', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.indigo,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Capturez le CIN ou le Permis du client',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 32),
            
            Row(
              children: [
                Expanded(
                  child: _buildScanButton(
                    label: 'Scanner CIN',
                    icon: Icons.badge,
                    onTap: () => _pickAndScan('cin'),
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: _buildScanButton(
                    label: 'Scanner Permis',
                    icon: Icons.drive_eta,
                    onTap: () => _pickAndScan('license'),
                  ),
                ),
              ],
            ),
            
            SizedBox(height: 32),
            
            if (_isProcessing)
              Center(child: CircularProgressIndicator())
            else if (_result != null)
              _buildResultCard()
            else
              _buildEmptyState(),
          ],
        ),
      ),
    );
  }

  Widget _buildScanButton({required String label, required IconData icon, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.symmetric(vertical: 24),
        decoration: BoxDecoration(
          color: Colors.indigo.withOpacity(0.05),
          border: Border.all(color: Colors.indigo.withOpacity(0.2)),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Column(
          children: [
            Icon(icon, size: 40, color: Colors.indigo),
            SizedBox(height: 12),
            Text(label, style: TextStyle(fontWeight: FontWeight.bold, color: Colors.indigo)),
          ],
        ),
      ),
    );
  }

  Widget _buildResultCard() {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.check_circle, color: Colors.green),
                SizedBox(width: 8),
                Text('Scan Réussi', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.green)),
              ],
            ),
            Divider(height: 32),
            _buildInfoRow('Numéro Document', _result?.documentNumber ?? 'Non détecté'),
            SizedBox(height: 12),
            if (_result?.rawText != null)
              ExpansionTile(
                title: Text('Texte Brut détecté', style: TextStyle(fontSize: 14)),
                children: [
                   Padding(
                     padding: EdgeInsets.all(8.0),
                     child: Text(_result!.rawText!, style: TextStyle(fontSize: 12, color: Colors.grey)),
                   ),
                ],
              ),
            SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                // Naviguer vers la création de réservation avec les données
              },
              child: Text('Continuer la Réservation'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.indigo,
                foregroundColor: Colors.white,
                padding: EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label.toUpperCase(), style: TextStyle(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.bold)),
        SizedBox(height: 4),
        Text(value, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildEmptyState() {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 60),
      decoration: BoxDecoration(
        color: Colors.grey.withOpacity(0.05),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        children: [
          Icon(Icons.document_scanner, size: 60, color: Colors.grey.withOpacity(0.3)),
          SizedBox(height: 16),
          Text('Aucun scan en cours', style: TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _ocrService.dispose();
    super.dispose();
  }
}
