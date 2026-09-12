'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { fetchWithdrawal } from "@/lib/api/affiliate";
import { toast } from "sonner";
import { format } from "date-fns";

const AffiliatePayoutInvoice = () => {
  const params = useParams();
  const id = params.id as string;
  const { token } = useAuth();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchWithdrawal(token, id);
        setData(res.data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load withdrawal invoice");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-gray-500">
          <Loader2 className="animate-spin mx-auto text-[#0eb755] mb-3" size={32} />
          <p>Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.withdrawal) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Invoice Not Found</h2>
          <p className="text-gray-500 mt-2">The invoice you're looking for doesn't exist.</p>
          <Link href={`/dashboard/affiliate/payouts`} className="inline-flex items-center gap-2 mt-6 text-[#0eb755] hover:underline">
            <ArrowLeft size={16} /> Back to Payouts
          </Link>
        </div>
      </div>
    );
  }

  const { withdrawal, setting, recent_commissions } = data;
  const affiliate = withdrawal.affiliate;
  const customer = affiliate?.customer;
  const payoutDetail = customer?.payout_detail || customer?.payoutDetail;
  const commissionsList = withdrawal.commissions && withdrawal.commissions.length > 0 
    ? withdrawal.commissions 
    : (recent_commissions && recent_commissions.length > 0 ? recent_commissions : []);

  return (
    <>
      <style type="text/css" media="print">
        {`
          @page { margin: 0; }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
        `}
      </style>
      <div className="min-h-screen print:min-h-0 print:block bg-gray-50 py-8 px-4 print:py-0 print:px-0 print:bg-white font-sans">
      {/* Top Bar (Hidden in Print) */}
      <div className="max-w-[794px] mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link 
          href={`/dashboard/affiliate/payouts`} 
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0eb755] transition-colors"
        >
          <ArrowLeft size={16} /> Back to Payouts
        </Link>
        <button 
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0eb755] text-white text-sm font-bold rounded hover:bg-[#0ca34b] transition-colors shadow-sm"
        >
          <Printer size={16} /> Print Invoice
        </button>
      </div>

      {/* Invoice Container - Styled like the Vendor Bill */}
      <div className="max-w-[794px] mx-auto bg-white p-[40px] md:p-[50px] text-[#1a1a1a] border border-gray-200 shadow-sm print:shadow-none print:border-none print:m-0">
        
        {/* HEADER */}
        <div className="flex justify-between items-start mb-[18px]">
          <div>
            <div className="font-['Barlow_Condensed',sans-serif] text-[32px] font-extrabold tracking-[.08em] text-[#0eb755] leading-none">SIRAJ TECH</div>
            <div className="font-['Barlow_Condensed',sans-serif] text-[11px] font-semibold tracking-[.35em] text-[#1a1a1a] mt-[2px]">L I M I T E D</div>
          </div>
          <div className="text-right text-[11.5px] leading-[1.7] text-[#333]">
           
            {setting?.address || 'West Shewrapara, Mirpur, Dhaka'}<br />
            {setting?.phone || 'Dhaka-1216, Bangladesh'}
          </div>
        </div>

        <hr className="border-t border-[#ddd] my-0 mb-[22px]" />

        {/* PARTIES */}
        <div className="flex justify-between mb-[26px] gap-[40px]">
          <div className="text-[12.5px] leading-[1.7]">
            <div className="text-[11px] font-bold uppercase tracking-[.07em] text-[#666] mb-1">From</div>
            <div className="font-bold text-[13px] text-[#1a1a1a]">{setting?.company_name || 'Siraj Tech Limited'}</div>
            <div>{setting?.email || 'info@sirajtech.com'}</div>
            <div>{setting?.address || 'Dhaka, Bangladesh'}</div>
          </div>
          <div className="text-[12.5px] leading-[1.7]">
            <div className="text-[11px] font-bold uppercase tracking-[.07em] text-[#666] mb-1">Affiliate / Payee</div>
            <div className="font-bold text-[13px] text-[#1a1a1a]">{customer?.name || 'N/A'}</div>
            <div>{customer?.email || ''}</div>
            <div>{customer?.phone || ''}</div>
            <div>{customer?.address || ''}</div>
          </div>
        </div>

        {/* BILL TITLE */}
        <div className="mb-[22px] flex items-center">
          <h1 className="font-['Barlow_Condensed',sans-serif] text-[28px] font-bold tracking-[.02em] text-[#1a1a1a] m-0">
            Payout Invoice <span className="text-[#0eb755]">#{String(withdrawal.id).padStart(5, '0')}</span>
          </h1>
          <span className={`inline-block px-2.5 py-[2px] text-[10px] font-bold uppercase tracking-[.08em] border-[1.5px] ml-3 relative -top-[2px] ${
            withdrawal.status === 'paid' ? 'border-[#0eb755] text-[#0eb755]' : 
            withdrawal.status === 'rejected' ? 'border-red-500 text-red-500' : 
            'border-[#f59e0b] text-[#f59e0b]'
          }`}>
            {withdrawal.status}
          </span>
        </div>

        {/* META */}
        <div className="flex gap-0 mb-[34px] mt-[10px]">
          <div className="flex-1 pr-4">
            <div className="text-[10px] font-bold uppercase tracking-[.07em] text-[#888] mb-[2px]">Requested Date</div>
            <div className="text-[12.5px] font-semibold text-[#1a1a1a]">
              {format(new Date(withdrawal.created_at), 'dd-MMM-yyyy HH:mm')}
            </div>
          </div>
          <div className="flex-1 pr-4">
            <div className="text-[10px] font-bold uppercase tracking-[.07em] text-[#888] mb-[2px]">Processed Date</div>
            <div className="text-[12.5px] font-semibold text-[#1a1a1a]">
              {withdrawal.status !== 'pending' ? format(new Date(withdrawal.updated_at), 'dd-MMM-yyyy HH:mm') : 'Pending'}
            </div>
          </div>
          <div className="flex-1 pr-4">
            <div className="text-[10px] font-bold uppercase tracking-[.07em] text-[#888] mb-[2px]">Payout Method</div>
            <div className="text-[12.5px] font-semibold text-[#1a1a1a] whitespace-pre-line">
              {payoutDetail ? (
                <>
                  <strong>{payoutDetail.method_name}</strong><br />
                  {payoutDetail.account_details}
                </>
              ) : 'N/A'}
            </div>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <table className="w-full border-collapse text-[12.5px] mb-[22px]">
          <thead>
            <tr className="bg-[#1a1a1a] text-white">
              <th className="py-[9px] px-[10px] border border-[#1a1a1a] text-[11px] font-bold uppercase tracking-[.05em] text-center w-[40px]">#</th>
              <th className="py-[9px] px-[10px] border border-[#1a1a1a] text-[11px] font-bold uppercase tracking-[.05em] text-left">Description</th>
              <th className="py-[9px] px-[10px] border border-[#1a1a1a] text-[11px] font-bold uppercase tracking-[.05em] text-right w-[150px]">Amount (BDT)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-[8px] px-[10px] border border-[#e0e0e0] text-center text-[#1a1a1a]">1</td>
              <td className="py-[8px] px-[10px] border border-[#e0e0e0] text-left text-[#1a1a1a]">
                <strong>Affiliate Commission Withdrawal</strong><br />
                <span className="text-[11.5px] text-[#555]">Commission payout request by affiliate {customer?.name || ''}</span>
              </td>
              <td className="py-[8px] px-[10px] border border-[#e0e0e0] text-right text-[#1a1a1a] font-bold">
                {parseFloat(withdrawal.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} BDT
              </td>
            </tr>

            {commissionsList && commissionsList.length > 0 && (
              <>
                <tr>
                  <td colSpan={3} className="py-[12px] px-[10px] bg-[#fafafa] italic text-[#1a1a1a] text-[12px] font-bold border-t border-b border-[#e0e0e0]">
                    Verified Commissions Included:
                  </td>
                </tr>
                {commissionsList.map((comm: any, index: number) => {
                  const orderRef = comm.order?.order_no || (comm.order_id ? `${comm.order_id}` : null);
                  const trackUrl = comm.order?.order_no ? `/track-order/${comm.order.order_no}` : (comm.order_id ? `/track-order/${comm.order_id}` : null);

                  return (
                    <tr key={comm.id || index} className="bg-white">
                      <td className="py-[6px] px-[10px] text-center text-[#555] text-[11.5px] border-b border-[#eee] border-l border-[#e0e0e0]">
                        {index + 2}
                      </td>
                      <td className="py-[6px] px-[10px] text-left text-[#555] text-[11.5px] border-b border-[#eee]">
                        {orderRef ? (
                          <>
                            Commission for Order{' '}
                            {trackUrl ? (
                              <Link href={trackUrl} target="_blank" className="text-[#0eb755] font-bold hover:underline">
                                #{orderRef}
                              </Link>
                            ) : (
                              <strong>#{orderRef}</strong>
                            )}
                          </>
                        ) : (
                          <>{comm.type ? String(comm.type).toUpperCase() : 'Affiliate'} Commission</>
                        )}
                      </td>
                      <td className="py-[6px] px-[10px] text-right text-[#555] text-[11.5px] border-b border-[#eee] border-r border-[#e0e0e0] font-bold">
                        {parseFloat(comm.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} BDT
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>

        {/* TOTAL BOX */}
        <div className="flex justify-end mb-[24px]">
          <div className="w-[280px] border border-[#e0e0e0]">
            <div className="flex justify-between py-[8px] px-[14px] text-[12.5px] border-b border-[#e0e0e0]">
              <span className="text-[#1a1a1a]">Total Amount</span>
              <span className="font-bold text-[#1a1a1a]">{parseFloat(withdrawal.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} BDT</span>
            </div>
            
            {withdrawal.status === 'paid' ? (
              <>
                <div className="flex justify-between py-[8px] px-[14px] text-[12.5px] border-b border-[#e0e0e0]">
                  <span className="text-[#1a1a1a]">Amount Paid</span>
                  <span className="font-bold text-[#1a1a1a]">{parseFloat(withdrawal.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} BDT</span>
                </div>
                <div className="flex justify-between py-[8px] px-[14px] text-[13.5px] font-bold bg-[#1a1a1a] text-white">
                  <span>Balance Due</span>
                  <span>0.00 BDT</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between py-[8px] px-[14px] text-[12.5px] border-b border-[#e0e0e0]">
                  <span className="text-[#1a1a1a]">Amount Paid</span>
                  <span className="font-bold text-[#1a1a1a]">0.00 BDT</span>
                </div>
                <div className="flex justify-between py-[8px] px-[14px] text-[13.5px] font-bold bg-[#1a1a1a] text-white">
                  <span>Balance Due</span>
                  <span>{parseFloat(withdrawal.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} BDT</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* APPROVALS */}
        <div className="flex gap-0 mb-[36px] border-t border-[#e0e0e0] pt-[16px]">
          <div className="flex-1 text-center px-[10px] border-r border-[#e8e8e8]">
            <div className="text-[10.5px] text-[#555] mb-1">{format(new Date(withdrawal.created_at), 'dd-MMM-yyyy HH:mm:ss')}</div>
            <div className="text-[10.5px] font-bold uppercase tracking-[.05em] text-[#1a1a1a]">Requested By</div>
            <div className="text-[11px] mt-1">{customer?.name || 'Affiliate'}</div>
          </div>
          <div className="flex-1 text-center px-[10px]">
            <div className="text-[10.5px] text-[#555] mb-1">
              {withdrawal.status === 'paid' ? format(new Date(withdrawal.updated_at), 'dd-MMM-yyyy HH:mm:ss') : 'Pending Authorization'}
            </div>
            <div className="text-[10.5px] font-bold uppercase tracking-[.05em] text-[#1a1a1a]">Authorized By</div>
            <div className="text-[11px] mt-1">Admin</div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-[#e0e0e0] pt-[12px] text-center text-[10.5px] text-[#888] leading-[1.6]">
          {/* Note: In a real app we might get the domain dynamically, but hardcoding for now or using window in client component */}
          <div>{setting?.email || 'info@sirajtech.com'}; sirajtech.com</div>
        </div>

      </div>
    </div>
    </>
  );
};

export default AffiliatePayoutInvoice;
