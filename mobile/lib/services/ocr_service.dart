import 'dart:io';
import 'package:google_mlkit_text_recognition/google_mlkit_text_recognition.dart';

class OcrResult {
  final String? firstName;
  final String? lastName;
  final String? documentNumber;
  final DateTime? expiryDate;
  final bool isSuccess;
  final String? rawText;

  OcrResult({
    this.firstName,
    this.lastName,
    this.documentNumber,
    this.expiryDate,
    required this.isSuccess,
    this.rawText,
  });
}

class OcrService {
  final TextRecognizer _textRecognizer = TextRecognizer();

  /// Scans an image (CIN or License) using Google ML Kit
  /// and extracts key textual information using RegEx patterns.
  Future<OcrResult> scanDocument(File imageFile, String type) async {
    final inputImage = InputImage.fromFile(imageFile);
    final recognizedText = await _textRecognizer.processImage(inputImage);
    final text = recognizedText.text;

    if (type == 'cin') {
      return _parseCIN(text);
    } else {
      return _parseLicense(text);
    }
  }

  OcrResult _parseCIN(String text) {
    // Basic extraction logic for Moroccan CIN
    // Pattern for CIN number: 1-2 letters followed by 5-7 digits
    final cinPattern = RegExp(r'[A-Z]{1,2}[0-9]{5,7}');
    final match = cinPattern.firstMatch(text);
    
    return OcrResult(
      documentNumber: match?.group(0),
      rawText: text,
      isSuccess: match != null,
    );
  }

  OcrResult _parseLicense(String text) {
    // Pattern for Moroccan Driving License: digits separated by slashes or spaces
    final licensePattern = RegExp(r'[0-9]{2,}\/[0-9]{4,}');
    final match = licensePattern.firstMatch(text);
    
    return OcrResult(
      documentNumber: match?.group(0),
      rawText: text,
      isSuccess: match != null,
    );
  }

  void dispose() {
    _textRecognizer.close();
  }
}
