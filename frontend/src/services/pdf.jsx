import pdfMake from "pdfmake/build/pdfmake";


import * as pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts?.pdfMake?.vfs || pdfFonts?.vfs || window?.pdfMake?.vfs;

export const generatePDF = (brandData) => {
  if (!brandData) return;

  // 1. Safely extract all root-level fields defined in the LoyaltyReport schema
  const key = brandData.key || "unknown_key";
  const name = brandData.name || "Rewards Program";
  const score = brandData.score || 0;
  const marketPosition = brandData.marketPosition || "Established";
  const confidence = brandData.confidence || 0;
  
  const earnRate = brandData.earnRate || "Data not available.";
  const redemption = brandData.redemption || "Data not available.";
  const strengths = brandData.strengths || "Data not available.";
  const weaknesses = brandData.weaknesses || "Data not available.";

  // 2. Extract nested objects (SentimentBreakdown & Summary)
  const sentiment = brandData.sentiment || { positive: 0, neutral: 0, negative: 0 };
  const summary = brandData.summary || {};
  const execSummary = summary.executiveSummary || "No executive summary available.";
  const keyFindings = summary.keyFindings || ["No key findings available."];
  const metadata = summary.metadata || { generated: new Date().toISOString().split('T')[0], confidence: "N/A", sources: 0 };

  // 3. Extract Lists/Arrays (Tier & Theme)
  const tiers = brandData.tiers || [];
  const positiveThemes = brandData.positiveThemes || [];
  const negativeThemes = brandData.negativeThemes || [];

  // 4. Build dynamic tables from the array data
  const tiersTableBody = [
    [
      { text: 'Tier Name', style: 'tableHeader' }, 
      { text: 'Requirement', style: 'tableHeader' }, 
      { text: 'Key Benefit', style: 'tableHeader' }
    ],
    ...tiers.map(t => [
      { text: t.name, style: 'tableValue', bold: true },
      { text: t.requirement, style: 'tableValue' },
      { text: t.benefit, style: 'tableValue' }
    ])
  ];

  const documentDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    
    // Header tracking the database key and AI metadata
    header: function(currentPage, pageCount) {
      return {
        columns: [
          { text: `Report ID: ${key.toUpperCase()}`, fontSize: 8, color: '#9ca3af' },
          { text: `Page ${currentPage} of ${pageCount}`, fontSize: 8, color: '#9ca3af', alignment: 'right' }
        ],
        margin: [40, 20, 40, 0]
      };
    },

    content: [
      // --- HEADER & METADATA SECTION ---
      { text: 'LOYALTY INTELLIGENCE REPORT', style: 'superHeader' },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: '#14b8a6' }], margin: [0, 0, 0, 15] },
      
  

      // --- EXECUTIVE SUMMARY & FINDINGS ---
      { text: 'Executive Summary', style: 'sectionHeader' },
      { text: execSummary, margin: [0, 0, 0, 15], lineHeight: 1.4 },
      
      { text: 'Key Findings', style: 'sectionHeader' },
      { ul: keyFindings, margin: [0, 0, 0, 25], lineHeight: 1.4 },

      // --- METRICS DASHBOARD (Score, Market, Sentiment Breakdowns) ---
      { text: 'Program Metrics & Sentiment', style: 'sectionHeader' },
      {
        table: {
          widths: ['16%', '16%', '16%', '17%', '17%', '18%'],
          body: [
            [
              { text: 'Score', style: 'tableHeader' },
              { text: 'Market', style: 'tableHeader' },
              { text: 'Confidence', style: 'tableHeader' },
              { text: 'Positive Sentiment', style: 'tableHeader', color: '#16a34a' },
              { text: 'Neutral Sentiment', style: 'tableHeader', color: '#6b7280' },
              { text: 'Negative Sentiment', style: 'tableHeader', color: '#dc2626' }
            ],
            [
              { text: `${score}/100`, style: 'metricValue' },
              { text: marketPosition, style: 'metricValue' },
              { text: `${confidence}%`, style: 'metricValue' },
              { text: `${sentiment.positive}%`, style: 'metricValue', color: '#16a34a' },
              { text: `${sentiment.neutral}%`, style: 'metricValue', color: '#6b7280' },
              { text: `${sentiment.negative}%`, style: 'metricValue', color: '#dc2626' }
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 25]
      },

      // --- PROGRAM MECHANICS ---
      { text: 'Core Mechanics', style: 'sectionHeader' },
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: 'Earning Rate', fontSize: 10, bold: true, color: '#14b8a6', margin: [0, 0, 0, 5] },
              { text: earnRate, fontSize: 10, lineHeight: 1.4, margin: [0, 0, 15, 0] }
            ]
          },
          {
            width: '50%',
            stack: [
              { text: 'Redemption Structure', fontSize: 10, bold: true, color: '#14b8a6', margin: [0, 0, 0, 5] },
              { text: redemption, fontSize: 10, lineHeight: 1.4 }
            ]
          }
        ],
        margin: [0, 0, 0, 25]
      },

      // --- MEMBERSHIP TIERS ---
      { text: 'Membership Tiers', style: 'sectionHeader' },
      tiers.length > 0 ? {
        table: {
          widths: ['25%', '35%', '40%'],
          body: tiersTableBody
        },
        layout: {
          hLineWidth: function(i, node) { return (i === 0 || i === 1 || i === node.table.body.length) ? 1 : 0.5; },
          vLineWidth: function(i) { return 0; },
          hLineColor: function(i) { return '#e5e7eb'; },
        },
        margin: [0, 0, 0, 25]
      } : { text: 'No tier data available for this program.', margin: [0, 0, 0, 25], color: '#6b7280', italics: true },

      // --- PROGRAM ANALYSIS (Strengths & Weaknesses) ---
      { text: 'Strategic Analysis', style: 'sectionHeader' },
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: 'Strengths', fontSize: 11, bold: true, color: '#111827', margin: [0, 0, 0, 5] },
              { text: strengths, fontSize: 10, lineHeight: 1.4, margin: [0, 0, 15, 0] }
            ]
          },
          {
            width: '50%',
            stack: [
              { text: 'Weaknesses', fontSize: 11, bold: true, color: '#111827', margin: [0, 0, 0, 5] },
              { text: weaknesses, fontSize: 10, lineHeight: 1.4 }
            ]
          }
        ],
        margin: [0, 0, 0, 25]
      },

      // --- THEMATIC BREAKDOWN ---
      { text: 'Customer Sentiment Themes', style: 'sectionHeader', pageBreak: 'before' },
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: 'Positive Discussion Themes', fontSize: 11, bold: true, color: '#16a34a', margin: [0, 0, 0, 10] },
              ...positiveThemes.map(t => ({
                margin: [0, 0, 15, 10],
                stack: [
                  { text: `Score: ${t.value}/100`, fontSize: 9, bold: true, color: '#16a34a' },
                  { text: t.text, fontSize: 10, lineHeight: 1.3 }
                ]
              }))
            ]
          },
          {
            width: '50%',
            stack: [
              { text: 'Negative Discussion Themes', fontSize: 11, bold: true, color: '#dc2626', margin: [0, 0, 0, 10] },
              ...negativeThemes.map(t => ({
                margin: [0, 0, 0, 10],
                stack: [
                  { text: `Score: ${t.value}/100`, fontSize: 9, bold: true, color: '#dc2626' },
                  { text: t.text, fontSize: 10, lineHeight: 1.3 }
                ]
              }))
            ]
          }
        ]
      }
    ],

    styles: {
      superHeader: { fontSize: 10, bold: true, color: '#14b8a6', tracking: 2, margin: [0, 0, 0, 5] },
      mainTitle: { fontSize: 24, bold: true, color: '#111827' },
      sectionHeader: { fontSize: 14, bold: true, color: '#111827', margin: [0, 0, 0, 10] },
      tableHeader: { bold: true, fontSize: 10, color: '#6b7280', fillColor: '#f9fafb', margin: [5, 5, 5, 5] },
      tableValue: { fontSize: 9, color: '#374151', margin: [5, 5, 5, 5] },
      metricValue: { fontSize: 14, bold: true, color: '#111827', margin: [5, 10, 5, 10], alignment: 'center' }
    },
    defaultStyle: {
      font: 'Roboto',
      color: '#374151'
    }
  };

  pdfMake.createPdf(documentDefinition).download(`${key}_Comprehensive_Report.pdf`);
};



