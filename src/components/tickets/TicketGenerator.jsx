import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { FiDownload, FiCopy, FiMail, FiCheck, FiPackage } from 'react-icons/fi';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import TicketDesigner from './TicketDesigner';

const TicketGenerator = ({ event, tickets = [], ticketTemplate }) => {
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTickets, setGeneratedTickets] = useState([]);
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTickets(tickets.map(ticket => ticket.id));
    } else {
      setSelectedTickets([]);
    }
  };
  
  const handleSelect = (id) => {
    if (selectedTickets.includes(id)) {
      setSelectedTickets(selectedTickets.filter(ticketId => ticketId !== id));
    } else {
      setSelectedTickets([...selectedTickets, id]);
    }
  };
  
  const generateTickets = async () => {
    if (selectedTickets.length === 0) {
      toast.error('Please select at least one ticket to generate');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // In a real app, this would be an API call to generate tickets
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock generated tickets
      const generated = selectedTickets.map(id => {
        const ticket = tickets.find(t => t.id === id);
        return {
          id,
          attendeeName: ticket.attendeeName,
          ticketType: ticket.ticketType,
          qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TICKET-${id}-EVENT-${event.id}`,
          downloadUrl: '#', // In a real app, this would be a URL to download the PDF
        };
      });
      
      setGeneratedTickets(generated);
      toast.success(`Successfully generated ${generated.length} tickets`);
    } catch (error) {
      toast.error('Failed to generate tickets');
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const downloadZip = async () => {
    if (generatedTickets.length === 0) {
      toast.error('No tickets to download');
      return;
    }
  
    const zip = new JSZip();
    const promises = generatedTickets.map(async (ticket) => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      const root = createRoot(container);
      root.render(<TicketDesigner event={event} renderTicket={ticket} />);
  
      // Wait for the container to be fully rendered
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      const canvas = await html2canvas(container);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
  
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const pdfBlob = pdf.output('blob');
      zip.file(`${ticket.attendeeName}_${event.name}.pdf`, pdfBlob);
  
      root.unmount();
      document.body.removeChild(container);
    });
  
    await Promise.all(promises);
  
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, `${event.name}_tickets.zip`);
      toast.success('Tickets downloaded successfully');
    });
  };
  const emailTickets = () => {
    // In a real app, this would send emails with tickets to attendees
    toast.info('Sending tickets via email...');
    setTimeout(() => {
      toast.success('Tickets sent successfully');
    }, 1500);
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Ticket Generator</h2>
      </div>
      
      <div className="p-6">
        {tickets.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No tickets available for generation. Please add attendees first.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Ticket Selection */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium text-gray-800">Select Tickets to Generate</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="select-all"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    onChange={handleSelectAll}
                    checked={selectedTickets.length === tickets.length}
                  />
                  <label htmlFor="select-all" className="text-sm text-gray-700">
                    Select All
                  </label>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-12 py-3 text-left pl-4">
                        <span className="sr-only">Select</span>
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attendee
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ticket Type
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="py-4 pl-4">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={selectedTickets.includes(ticket.id)}
                            onChange={() => handleSelect(ticket.id)}
                          />
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{ticket.attendeeName}</div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{ticket.email}</div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {ticket.ticketType}
                          </span>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            ticket.generated 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {ticket.generated ? 'Generated' : 'Not Generated'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Generate Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={generateTickets}
                disabled={isGenerating || selectedTickets.length === 0}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center ${
                  (isGenerating || selectedTickets.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FiDownload className="h-4 w-4 mr-2" />
                    Generate {selectedTickets.length} Tickets
                  </>
                )}
              </button>
            </div>
            
            {/* Generated Tickets */}
            {generatedTickets.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-medium text-gray-800">Generated Tickets</h3>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={emailTickets}
                      className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                    >
                      <FiMail className="h-4 w-4 mr-1" />
                      Email All
                    </button>
                    <button
                      type="button"
                      onClick={downloadZip}
                      className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                    >
                      <FiPackage className="h-4 w-4 mr-1" />
                      Download ZIP
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generatedTickets.map((ticket) => (
                    <div key={ticket.id} id={`ticket-${ticket.id}`} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{ticket.attendeeName}</h4>
                            <p className="text-sm text-gray-500">{ticket.ticketType}</p>
                          </div>
                          <img 
                            src={ticket.qrCode} 
                            alt="QR Code" 
                            className="h-20 w-20"
                          />
                        </div>
                        
                        <div className="mt-4 flex space-x-2">
                          <a
                            href={ticket.downloadUrl}
                            className="flex-1 flex justify-center items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <FiDownload className="h-4 w-4 mr-1" />
                            Download
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              // In a real app, this would copy a ticket link to clipboard
                              toast.success('Ticket link copied to clipboard');
                            }}
                            className="flex-1 flex justify-center items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <FiCopy className="h-4 w-4 mr-1" />
                            Copy Link
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketGenerator;