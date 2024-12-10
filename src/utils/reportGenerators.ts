import { utils, writeFile } from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, BorderStyle } from 'docx';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Task } from '../types';

interface ReportTask {
  action: string;
  responsible: string;
  plannedStart: string;
  plannedEnd: string;
  progress: string;
}

type ReportPeriod = 'daily' | 'weekly' | 'monthly';

const getTasksForPeriod = (tasks: Task[], period: ReportPeriod): Task[] => {
  const now = new Date();
  const periodStart = period === 'daily' 
    ? startOfDay(now)
    : period === 'weekly'
    ? startOfWeek(now, { weekStartsOn: 1 })
    : startOfMonth(now);
  
  const periodEnd = period === 'daily'
    ? endOfDay(now)
    : period === 'weekly'
    ? endOfWeek(now, { weekStartsOn: 1 })
    : endOfMonth(now);

  return tasks.filter(task => {
    const plannedStart = new Date(task.plannedStart);
    return plannedStart >= periodStart && plannedStart <= periodEnd;
  });
};

const formatTasksForReport = (tasks: Task[]): ReportTask[] => {
  return tasks.map(task => ({
    action: task.action,
    responsible: task.responsible,
    plannedStart: format(new Date(task.plannedStart), 'dd/MM/yyyy'),
    plannedEnd: format(new Date(task.plannedEnd), 'dd/MM/yyyy'),
    progress: `${task.progress}%`,
  }));
};

export const generateExcelReport = (tasks: Task[], period: ReportPeriod) => {
  const filteredTasks = getTasksForPeriod(tasks, period);
  const formattedTasks = formatTasksForReport(filteredTasks);
  
  const worksheet = utils.json_to_sheet(formattedTasks);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Tasks');
  
  writeFile(workbook, `tasks_${period}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};

export const generatePDFReport = (tasks: Task[], period: ReportPeriod) => {
  const filteredTasks = getTasksForPeriod(tasks, period);
  const formattedTasks = formatTasksForReport(filteredTasks);
  
  const doc = new jsPDF();
  const title = `${period.charAt(0).toUpperCase() + period.slice(1)} Task Report`;
  
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 25);
  
  autoTable(doc, {
    head: [['Action', 'Responsible', 'Planned Start', 'Planned End', 'Progress']],
    body: formattedTasks.map(task => [
      task.action,
      task.responsible,
      task.plannedStart,
      task.plannedEnd,
      task.progress,
    ]),
    startY: 30,
  });
  
  doc.save(`tasks_${period}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const generateWordReport = async (tasks: Task[], period: ReportPeriod) => {
  const filteredTasks = getTasksForPeriod(tasks, period);
  const formattedTasks = formatTasksForReport(filteredTasks);
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: `${period.charAt(0).toUpperCase() + period.slice(1)} Task Report`,
          heading: 'Heading1',
        }),
        new Paragraph({
          text: `Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
          spacing: { before: 400 },
        }),
        new Table({
          rows: [
            new TableRow({
              children: [
                'Action',
                'Responsible',
                'Planned Start',
                'Planned End',
                'Progress',
              ].map(header => new TableCell({
                children: [new Paragraph(header)],
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              })),
            }),
            ...formattedTasks.map(task => new TableRow({
              children: [
                task.action,
                task.responsible,
                task.plannedStart,
                task.plannedEnd,
                task.progress,
              ].map(text => new TableCell({
                children: [new Paragraph(text)],
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              })),
            })),
          ],
        }),
      ],
    }],
  });
  
  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tasks_${period}_${format(new Date(), 'yyyy-MM-dd')}.docx`;
  a.click();
  window.URL.revokeObjectURL(url);
};