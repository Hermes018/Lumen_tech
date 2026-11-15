/** @purpose Zero-dependency Universal Business Report & Workbook Engine generating RFC-4180 CSV (UTF-8 BOM), Microsoft Office Open XML SpreadsheetML (.xls/.xlsx), and Print-Perfect A4/Letter Institutional PDF Report Windows */

import { brand } from '@lumen/config';

export interface ReportColumn {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
}

export interface ReportSheet {
  sheetName: string;
  title: string;
  subtitle?: string;
  summaryMetrics?: Array<{ label: string; value: string }>;
  columns: ReportColumn[];
  rows: Array<Record<string, string | number>>;
}

export interface InstitutionalReportPayload {
  reportId: string;
  documentTitle: string;
  subtitle: string;
  organizationName?: string;
  generatedByRole: string;
  generatedAtIso: string;
  currencyNote?: string;
  verificationHash: string;
  sheets: ReportSheet[];
  footerLegalNote?: string;
}

function escapeCsvCell(value: string | number | undefined): string {
  if (value === undefined || value === null) return '';
  const str = String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function escapeXml(value: string | number | undefined): string {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeHtml(value: string | number | undefined): string {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeSheetName(raw: string, usedNames: Set<string>): string {
  const cleaned = raw.replace(/[\\/?*[\]:]/g, ' ').trim() || 'Sheet';
  let candidate = cleaned.slice(0, 31);
  let suffix = 2;
  while (usedNames.has(candidate.toLowerCase())) {
    const tag = ` (${suffix})`;
    candidate = `${cleaned.slice(0, 31 - tag.length)}${tag}`;
    suffix += 1;
  }
  usedNames.add(candidate.toLowerCase());
  return candidate;
}

function sanitizeFilenameBase(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'lumen-report';
}

/**
 * Generates an RFC-4180 compliant CSV string prefixed with UTF-8 BOM (\uFEFF)
 * so Microsoft Excel opens BDT (৳) and Bengali (বাংলা) characters without mojibake.
 */
export function buildCsvString(sheet: ReportSheet): string {
  const lines: string[] = [];
  lines.push(sheet.columns.map((col) => escapeCsvCell(col.header)).join(','));
  for (const row of sheet.rows) {
    const cells = sheet.columns.map((col) => escapeCsvCell(row[col.key]));
    lines.push(cells.join(','));
  }
  return `\uFEFF${lines.join('\r\n')}\r\n`;
}

/**
 * Generates a valid Microsoft Office Open XML SpreadsheetML workbook containing
 * all worksheets in payload.sheets with styled header rows, summary KPI blocks,
 * and typed numeric/string cells.
 */
export function buildExcelSpreadsheetXml(payload: InstitutionalReportPayload): string {
  const usedNames = new Set<string>();
  const orgName = payload.organizationName ?? brand.name;

  const worksheetsXml = payload.sheets
    .map((sheet) => {
      const safeName = sanitizeSheetName(sheet.sheetName, usedNames);
      const colCount = Math.max(1, sheet.columns.length);

      const summaryRowsXml = (sheet.summaryMetrics ?? [])
        .map(
          (m) => `
      <Row>
        <Cell ss:StyleID="SummaryLabel"><Data ss:Type="String">${escapeXml(m.label)}</Data></Cell>
        <Cell ss:StyleID="SummaryValue"><Data ss:Type="String">${escapeXml(m.value)}</Data></Cell>
      </Row>`,
        )
        .join('');

      const headerCellsXml = sheet.columns
        .map(
          (col) =>
            `<Cell ss:StyleID="TableHeader"><Data ss:Type="String">${escapeXml(col.header)}</Data></Cell>`,
        )
        .join('');

      const dataRowsXml = sheet.rows
        .map((row) => {
          const cellsXml = sheet.columns
            .map((col) => {
              const rawVal = row[col.key];
              if (typeof rawVal === 'number' && Number.isFinite(rawVal)) {
                const styleId = col.align === 'right' ? 'NumericRight' : 'NumericCell';
                return `<Cell ss:StyleID="${styleId}"><Data ss:Type="Number">${rawVal}</Data></Cell>`;
              }
              const styleId =
                col.align === 'right'
                  ? 'TextRight'
                  : col.align === 'center'
                    ? 'TextCenter'
                    : 'TextLeft';
              return `<Cell ss:StyleID="${styleId}"><Data ss:Type="String">${escapeXml(rawVal ?? '')}</Data></Cell>`;
            })
            .join('');
          return `      <Row>${cellsXml}</Row>`;
        })
        .join('\n');

      const columnDefsXml = sheet.columns
        .map(() => `      <Column ss:AutoFitWidth="1" ss:Width="135"/>`)
        .join('\n');

      return `  <Worksheet ss:Name="${escapeXml(safeName)}">
    <Table>
${columnDefsXml}
      <Row ss:Height="24">
        <Cell ss:MergeAcross="${colCount - 1}" ss:StyleID="DocTitle"><Data ss:Type="String">${escapeXml(orgName)} — ${escapeXml(sheet.title)}</Data></Cell>
      </Row>
      <Row>
        <Cell ss:MergeAcross="${colCount - 1}" ss:StyleID="DocMeta"><Data ss:Type="String">${escapeXml(sheet.subtitle ?? payload.subtitle)} | Report ID: ${escapeXml(payload.reportId)} | Generated: ${escapeXml(payload.generatedAtIso)} | Role: ${escapeXml(payload.generatedByRole)}</Data></Cell>
      </Row>
      <Row>
        <Cell ss:MergeAcross="${colCount - 1}" ss:StyleID="DocHash"><Data ss:Type="String">HMAC-SHA256 Verification: ${escapeXml(payload.verificationHash)}</Data></Cell>
      </Row>${summaryRowsXml}
      <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
      <Row ss:Height="22">
        ${headerCellsXml}
      </Row>
${dataRowsXml}
    </Table>
  </Worksheet>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40">
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Center"/>
      <Font ss:FontName="Calibri" ss:Size="10" ss:Color="#1C1917"/>
    </Style>
    <Style ss:ID="DocTitle">
      <Font ss:FontName="Georgia" ss:Size="13" ss:Bold="1" ss:Color="#2A080E"/>
      <Interior ss:Color="#F6F1EA" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="DocMeta">
      <Font ss:FontName="Calibri" ss:Size="9" ss:Color="#57534E"/>
    </Style>
    <Style ss:ID="DocHash">
      <Font ss:FontName="Consolas" ss:Size="8" ss:Color="#78716C"/>
    </Style>
    <Style ss:ID="SummaryLabel">
      <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#2A080E"/>
      <Interior ss:Color="#FAF7F2" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="SummaryValue">
      <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#1C1917"/>
      <Interior ss:Color="#FAF7F2" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="TableHeader">
      <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#2A080E"/>
      <Interior ss:Color="#F6F1EA" ss:Pattern="Solid"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#2A080E"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D6D3D1"/>
      </Borders>
    </Style>
    <Style ss:ID="TextLeft">
      <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E7E5E4"/>
      </Borders>
    </Style>
    <Style ss:ID="TextRight">
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E7E5E4"/>
      </Borders>
    </Style>
    <Style ss:ID="TextCenter">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E7E5E4"/>
      </Borders>
    </Style>
    <Style ss:ID="NumericCell">
      <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
      <NumberFormat ss:Format="#,##0.##"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E7E5E4"/>
      </Borders>
    </Style>
    <Style ss:ID="NumericRight">
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
      <NumberFormat ss:Format="#,##0.##"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E7E5E4"/>
      </Borders>
    </Style>
  </Styles>
${worksheetsXml}
</Workbook>`;
}

/**
 * Generates a self-contained HTML5 A4/Letter printable institutional report document
 * with institutional letterhead, summary stat strip, bordered accounting tables,
 * signature/stamp blocks, and @media print page-break rules.
 */
export function buildPrintableHtmlDocument(payload: InstitutionalReportPayload): string {
  const orgName = payload.organizationName ?? brand.name;
  const legalNote =
    payload.footerLegalNote ??
    'Certified Institutional Filing — Generated from Server-Authoritative Ledger. Unauthorized alteration invalidates HMAC-SHA256 seal.';

  const sheetsHtml = payload.sheets
    .map((sheet, idx) => {
      const metricsHtml =
        sheet.summaryMetrics && sheet.summaryMetrics.length > 0
          ? `<div class="kpi-strip">
          ${sheet.summaryMetrics
            .map(
              (m) => `<div class="kpi-cell">
              <div class="kpi-label">${escapeHtml(m.label)}</div>
              <div class="kpi-value">${escapeHtml(m.value)}</div>
            </div>`,
            )
            .join('')}
        </div>`
          : '';

      const theadHtml = sheet.columns
        .map((col) => {
          const alignClass =
            col.align === 'right' ? 'num' : col.align === 'center' ? 'ctr' : 'txt';
          return `<th scope="col" class="${alignClass}">${escapeHtml(col.header)}</th>`;
        })
        .join('');

      const tbodyHtml =
        sheet.rows.length === 0
          ? `<tr><td colspan="${Math.max(1, sheet.columns.length)}" class="empty-row">No records in this schedule.</td></tr>`
          : sheet.rows
              .map((row) => {
                const cells = sheet.columns
                  .map((col, colIdx) => {
                    const val = row[col.key];
                    const alignClass =
                      col.align === 'right' ? 'num' : col.align === 'center' ? 'ctr' : 'txt';
                    const formatted =
                      typeof val === 'number' && Number.isFinite(val)
                        ? val.toLocaleString('en-US')
                        : String(val ?? '');
                    if (colIdx === 0) {
                      return `<th scope="row" class="${alignClass}">${escapeHtml(formatted)}</th>`;
                    }
                    return `<td class="${alignClass}">${escapeHtml(formatted)}</td>`;
                  })
                  .join('');
                return `<tr>${cells}</tr>`;
              })
              .join('');

      return `<section class="sheet-section${idx > 0 ? ' page-break' : ''}">
        <div class="sheet-header">
          <h2>${escapeHtml(sheet.title)}</h2>
          ${sheet.subtitle ? `<p class="sheet-sub">${escapeHtml(sheet.subtitle)}</p>` : ''}
        </div>
        ${metricsHtml}
        <table>
          <thead><tr>${theadHtml}</tr></thead>
          <tbody>${tbodyHtml}</tbody>
        </table>
      </section>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(payload.documentTitle)} — ${escapeHtml(payload.reportId)}</title>
  <style>
    @page { size: A4 portrait; margin: 16mm 14mm; }
    * { box-sizing: border-box; }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      color: #1C1917;
      background: #FFFFFF;
      margin: 0;
      padding: 24px;
      font-size: 11px;
      line-height: 1.45;
    }
    .letterhead {
      border-bottom: 2px solid #2A080E;
      padding-bottom: 12px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
    }
    .brand-kicker {
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #6B1D2F;
      margin-bottom: 4px;
    }
    h1 {
      margin: 0;
      font-size: 20px;
      color: #2A080E;
      font-weight: 700;
    }
    .subtitle {
      margin: 4px 0 0;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 11px;
      color: #57534E;
    }
    .meta-block {
      text-align: right;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 10px;
      color: #44403C;
    }
    .meta-block strong { color: #2A080E; }
    .sheet-section { margin-bottom: 22px; }
    .page-break { page-break-before: always; break-before: page; }
    .sheet-header h2 {
      margin: 0 0 4px;
      font-size: 14px;
      color: #2A080E;
    }
    .sheet-sub {
      margin: 0 0 10px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 10px;
      color: #57534E;
    }
    .kpi-strip {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      border: 1px solid #D6D3D1;
      background: #FAF7F2;
      margin-bottom: 12px;
    }
    .kpi-cell {
      padding: 8px 10px;
      border-right: 1px solid #E7E5E4;
    }
    .kpi-cell:last-child { border-right: none; }
    .kpi-label {
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 9px;
      color: #57534E;
      margin-bottom: 2px;
    }
    .kpi-value {
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 12px;
      font-weight: 700;
      color: #2A080E;
      font-variant-numeric: tabular-nums;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 10px;
    }
    thead th {
      background: #F6F1EA;
      color: #2A080E;
      font-weight: 700;
      padding: 7px 8px;
      border-top: 1px solid #2A080E;
      border-bottom: 2px solid #2A080E;
      border-right: 1px solid #E7E5E4;
    }
    thead th:last-child { border-right: none; }
    tbody th, tbody td {
      padding: 6px 8px;
      border-bottom: 1px solid #E7E5E4;
      border-right: 1px solid #F0ECE6;
      vertical-align: top;
    }
    tbody th {
      font-weight: 600;
      color: #1C1917;
    }
    tbody td:last-child { border-right: none; }
    .txt { text-align: left; }
    .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
    .ctr { text-align: center; }
    .empty-row { text-align: center; color: #78716C; padding: 14px; }
    .signatures {
      margin-top: 28px;
      padding-top: 14px;
      border-top: 1px solid #D6D3D1;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 10px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .sig-box {
      border: 1px solid #D6D3D1;
      padding: 10px 12px;
      background: #FAF7F2;
    }
    .sig-title { font-weight: 700; color: #2A080E; margin-bottom: 18px; }
    .sig-line { border-top: 1px solid #78716C; padding-top: 4px; color: #57534E; font-size: 9px; }
    .hash-mono { font-family: monospace; font-size: 8.5px; word-break: break-all; color: #44403C; }
    .legal-footer {
      margin-top: 14px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 9px;
      color: #78716C;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <header class="letterhead">
    <div>
      <div class="brand-kicker">${escapeHtml(orgName)} · Institutional Financial &amp; Academic Filing</div>
      <h1>${escapeHtml(payload.documentTitle)}</h1>
      <p class="subtitle">${escapeHtml(payload.subtitle)}</p>
    </div>
    <div class="meta-block">
      <div><strong>Report ID:</strong> ${escapeHtml(payload.reportId)}</div>
      <div><strong>Role:</strong> ${escapeHtml(payload.generatedByRole)}</div>
      <div><strong>Timestamp:</strong> ${escapeHtml(payload.generatedAtIso)}</div>
      ${payload.currencyNote ? `<div><strong>Currency:</strong> ${escapeHtml(payload.currencyNote)}</div>` : ''}
    </div>
  </header>

  ${sheetsHtml}

  <footer class="signatures">
    <div class="sig-box">
      <div class="sig-title">Prepared By</div>
      <div class="sig-line">${escapeHtml(payload.generatedByRole)} · ${escapeHtml(orgName)}</div>
    </div>
    <div class="sig-box">
      <div class="sig-title">Verified By Compliance Auditor</div>
      <div class="sig-line">Psychometric &amp; Financial QA Sign-Off</div>
    </div>
    <div class="sig-box">
      <div class="sig-title">HMAC-SHA256 Verification Hash</div>
      <div class="hash-mono">${escapeHtml(payload.verificationHash)}</div>
    </div>
  </footer>
  <p class="legal-footer">${escapeHtml(legalNote)}</p>
</body>
</html>`;
}

function triggerBlobDownload(content: string, mimeType: string, filename: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadCsvReport(
  payload: InstitutionalReportPayload,
  filenameBase: string,
  sheetIndex = 0,
): void {
  const targetSheet = payload.sheets[sheetIndex] ?? payload.sheets[0];
  if (!targetSheet) return;
  const csv = buildCsvString(targetSheet);
  triggerBlobDownload(csv, 'text/csv;charset=utf-8', `${sanitizeFilenameBase(filenameBase)}.csv`);
}

export function downloadExcelReport(
  payload: InstitutionalReportPayload,
  filenameBase: string,
): void {
  const xml = buildExcelSpreadsheetXml(payload);
  triggerBlobDownload(
    xml,
    'application/vnd.ms-excel;charset=utf-8',
    `${sanitizeFilenameBase(filenameBase)}.xls`,
  );
}

export function openPrintablePdfReport(payload: InstitutionalReportPayload): void {
  if (typeof window === 'undefined') return;
  const html = buildPrintableHtmlDocument(payload);
  const printWin = window.open('', '_blank', 'noopener,noreferrer,width=980,height=780');
  if (printWin && printWin.document) {
    printWin.document.open();
    printWin.document.write(html);
    printWin.document.close();
    printWin.focus();
    window.setTimeout(() => {
      try {
        printWin.print();
      } catch {
        // Ignore headless print errors
      }
    }, 250);
    return;
  }
  triggerBlobDownload(
    html,
    'text/html;charset=utf-8',
    `${sanitizeFilenameBase(payload.reportId)}-printable.html`,
  );
}
