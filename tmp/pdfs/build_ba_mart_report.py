from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable

output = 'output/pdf/BA_Mart_APK_Reverse_Engineering_Report.pdf'
doc = SimpleDocTemplate(output, pagesize=A4, rightMargin=20*mm, leftMargin=20*mm,
                        topMargin=20*mm, bottomMargin=19*mm,
                        title='BA Mart APK - Reverse Engineering Report',
                        author='Codex')
green = colors.HexColor('#078A45')
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='ReportTitle', parent=styles['Title'], fontName='Helvetica-Bold',
                          fontSize=23, leading=28, textColor=green, alignment=TA_LEFT,
                          spaceAfter=5*mm))
styles.add(ParagraphStyle(name='Deck', parent=styles['Normal'], fontSize=10.5, leading=15,
                          textColor=colors.HexColor('#50615A'), spaceAfter=7*mm))
styles.add(ParagraphStyle(name='Section', parent=styles['Heading2'], fontName='Helvetica-Bold',
                          fontSize=14, leading=18, textColor=green, spaceBefore=5*mm, spaceAfter=2*mm,
                          keepWithNext=True))
styles.add(ParagraphStyle(name='BodyClean', parent=styles['BodyText'], fontSize=9.5, leading=14,
                          spaceAfter=2.5*mm))
styles.add(ParagraphStyle(name='BulletClean', parent=styles['BodyText'], fontSize=9.2, leading=13,
                          leftIndent=12, firstLineIndent=-8, bulletIndent=0, spaceAfter=1.5*mm))
story = [Paragraph('BA Mart APK', styles['ReportTitle']),
         Paragraph('Reverse-Engineering Summary', styles['Heading1']),
         Paragraph('Application identity, observed behavior, permissions, and recovery limits', styles['Deck']),
         HRFlowable(width='100%', thickness=1.2, color=green, spaceAfter=4*mm)]

def section(title): story.append(Paragraph(title, styles['Section']))
def bullet(text): story.append(Paragraph('&bull; ' + text, styles['BulletClean']))

section('Application identity')
for line in ['App label: <b>BA Mart</b>', 'Branding: <b>BA e-Mart - One App, Multiple Services</b>',
             'Android package: <font name="Courier">com.bamart.app</font>',
             'Version: 1.0.0 (version code 16)', 'Framework: Flutter; compiled Dart AOT snapshot at <font name="Courier">lib/arm64-v8a/libapp.so</font>',
             'Main activity: <font name="Courier">com.bamart.app.MainActivity</font>']:
    bullet(line)

section('What the app does')
story.append(Paragraph('The APK is a BA Mart customer shopping application. Its Flutter shell includes splash and offline assets and a WebView page implementation. Evidence in the compiled app indicates that the shopping experience is served as a web application.', styles['BodyClean']))
story.append(Paragraph('<b>Observed web addresses and routes</b>', styles['BodyClean']))
for line in ['https://cgdemo.sbs/ba-mart-crm/ba-mart-app/',
             'https://cgdemo.sbs/ba-mart-crm/ba-mart-app/customer/login',
             'customer/login and customer/reset-password']:
    bullet('<font name="Courier">' + line + '</font>')

section('Recovered Flutter source references')
for line in ['package:ba_mart/main.dart', 'package:ba_mart/splash_screen.dart',
             'package:ba_mart/webview_page.dart', 'package:ba_mart/no_internet_page.dart',
             'package:ba_mart/deep_link_service.dart']:
    bullet('<font name="Courier">' + line + '</font>')

section('Declared permissions and components')
story.append(Paragraph('The Android manifest declares access to the internet and network state, coarse and fine location, camera and autofocus, phone calls, audio recording, media/images/videos, and external storage. It also includes WebView and deep-link components and an Android FileProvider.', styles['BodyClean']))

section('Source-code recovery limits')
story.append(Paragraph('The APK does not contain the original Dart project files. Flutter release builds compile Dart code into an ahead-of-time snapshot, so the original source files, comments, variable names, and exact project structure cannot be reliably reconstructed from this APK. The extracted APK files and assets are retained in the accompanying <font name="Courier">_apk_analysis</font> directory.', styles['BodyClean']))

section('Assets found')
for line in ['assets/flutter_assets/assets/splash.png', 'assets/flutter_assets/assets/logo.png',
             'assets/flutter_assets/assets/icon.png', 'offline/error illustration assets']:
    bullet('<font name="Courier">' + line + '</font>')

def footer(canvas, document):
    canvas.saveState()
    w, _ = A4
    canvas.setStrokeColor(colors.HexColor('#DCE8E1'))
    canvas.line(20*mm, 14*mm, w-20*mm, 14*mm)
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(colors.HexColor('#6B7771'))
    canvas.drawString(20*mm, 9*mm, 'BA Mart APK analysis')
    canvas.drawRightString(w-20*mm, 9*mm, f'Page {document.page}')
    canvas.restoreState()

doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(output)
