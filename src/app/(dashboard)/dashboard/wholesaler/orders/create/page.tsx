'use client';

import { useState, useEffect } from "react";
import { searchCustomerByPhone, createWholesalerOrder, fetchWholesalerProducts } from "@/lib/api/wholesaler";
import { calculateShippingCharge } from "@/lib/api/checkout";
import { API_BASE_URL } from "@/lib/api/config";
import { useAuth } from "@/providers/AuthProvider";
import { Check, ChevronsUpDown, Plus, Trash2, ArrowLeft, User as UserIcon, Package, CreditCard, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ProductItem {
  id: string;
  product_id?: number;
  product_name: string;
  variant_id?: number;
  weight: number;
  quantity: number;
  price: number;
  total: number;
  productOpen?: boolean;
  variantOpen?: boolean;
}

export default function WholesalerCreateOrder() {
  const { token, user } = useAuth();
  const router = useRouter();
  
  // Form State
  const [date, setDate] = useState("");
  const [officeId, setOfficeId] = useState("");
  
  useEffect(() => {
    setDate(new Date().toISOString().split('T')[0]);
  }, []);
  
  // Customer State
  const [phoneSearch, setPhoneSearch] = useState("");
  const [customerOptions, setCustomerOptions] = useState<any[]>([]);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customer, setCustomer] = useState<any>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({ name: "", phone: "", address: "" });

  // Products & APIs State
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [activeStatuses, setActiveStatuses] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    fetchWholesalerProducts(token)
      .then(res => {
        setAvailableProducts(res.products || []);
        setBankAccounts(res.bank_accounts || []);
        setActiveStatuses(res.order_statuses || []);
        if (res.order_statuses && res.order_statuses.length > 0) {
            const placedStatus = res.order_statuses.find((s: any) => s.name === "Order Placed");
            if (placedStatus) {
                setStatus(placedStatus.name);
            } else {
                setStatus(res.order_statuses[0].name);
            }
        }
      })
      .catch(console.error);

    // Fetch active shipping rates
    fetch(API_BASE_URL + '/api/v1/shipping-rates/active')
      .then(r => r.json())
      .then(res => {
         if (res.success) setShippingRates(res.shipping_rates || []);
      }).catch(console.error);
  }, [token]);
  
  // Financials State
  const [paymentType, setPaymentType] = useState("cash");
  const [paymentAccountId, setPaymentAccountId] = useState("");
  const [transactionNo, setTransactionNo] = useState("");
  const [status, setStatus] = useState("Order Placed");
  const [courierName, setCourierName] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [note, setNote] = useState("");
  const [shippingRateId, setShippingRateId] = useState("");
  const [deliveryZone, setDeliveryZone] = useState("inside");
  const [advanceAmount, setAdvanceAmount] = useState<number>(0);
  
  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  // Dynamic Options
  const courierOptions = ["Steadfast", "Pathao", "Sundarban", "Sundarbans", "CarryBee", "Shodagor Express", "Send"];

  // Dialog States
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Computed Values
  const totalWeight = products.reduce((sum, p) => sum + (p.weight * p.quantity), 0);
  const saleAmount = products.reduce((sum, p) => sum + p.total, 0);

  // Calculate Courier Charge
  const calculatedCourierCharge = () => {
    if (!shippingRateId) return 0;
    const rate = shippingRates.find(r => r.id === Number(shippingRateId));
    if (!rate) return 0;
    
    return calculateShippingCharge(rate, totalWeight, deliveryZone === 'inside');
  };
  
  const courierCharge = calculatedCourierCharge();
  const subtotalBeforeCoupon = saleAmount + courierCharge;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const totalAmount = Math.max(0, subtotalBeforeCoupon - discountAmount);
  const dueAmount = Math.max(0, totalAmount - advanceAmount);

  const handleApplyCoupon = async () => {
    setCouponError("");
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code.");
      return;
    }
    if (products.length === 0) {
      setCouponError("Please add products first.");
      return;
    }

    const currentPhone = isNewCustomer ? newCustomerData.phone : customer?.phone;

    try {
      const res = await fetch(API_BASE_URL + '/api/v1/checkout/apply-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          coupon_code: couponCode,
          phone: currentPhone,
          products: products.map(p => ({
            product_id: p.product_id,
            variant_id: p.variant_id,
            quantity: p.quantity,
            price: p.price
          }))
        })
      });

      const data = await res.json();
      if (data.success) {
        setAppliedCoupon({
          ...data.coupon,
          discount: data.discount
        });
        toast.success(data.message || "Coupon applied successfully!");
      } else {
        setCouponError(data.message || "Failed to apply coupon.");
        setAppliedCoupon(null);
      }
    } catch (err) {
      setCouponError("Network error while applying coupon.");
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  // Handlers
  const handleSearchCustomer = async (query: string) => {
    setPhoneSearch(query);
    if (!query || !token) {
        setCustomerOptions([]);
        return;
    }
    try {
      const res = await searchCustomerByPhone(token, query);
      setCustomerOptions(res.customers || []);
    } catch (e: any) {
      console.error(e);
      setCustomerOptions([]);
    }
  };

  const addProductRow = () => {
    setProducts([
      ...products,
      { id: Math.random().toString(), product_name: "", weight: 0, quantity: 1, price: 0, total: 0 }
    ]);
  };

  const removeProductRow = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateProductRow = (id: string, field: keyof ProductItem, value: any) => {
    setProducts(prevProducts => prevProducts.map(p => {
      if (p.id === id) {
        let updated = { ...p, [field]: value };
        
        if (field === 'product_id') {
           const selectedProd = availableProducts.find(ap => ap.id === Number(value));
           updated.variant_id = undefined;
           if (selectedProd) {
               updated.product_name = selectedProd.name;
               
               const wp = selectedProd.calculated_wholesale_price > 0 
                    ? selectedProd.calculated_wholesale_price 
                    : (selectedProd.wholesale_sale_price > 0 ? selectedProd.wholesale_sale_price : (selectedProd.wholesale_price > 0 ? selectedProd.wholesale_price : 0));
               
               updated.price = Number(wp > 0 ? wp : (selectedProd.sale_price > 0 ? selectedProd.sale_price : selectedProd.regular_price)) || 0;
               updated.weight = Number(selectedProd.weight_kg) || 0;
           } else {
               updated.product_name = "";
               updated.price = 0;
               updated.weight = 0;
           }
        }
        
        if (field === 'variant_id') {
           const selectedProd = availableProducts.find(ap => ap.id === p.product_id);
           const selectedVar = selectedProd?.variants?.find((v: any) => v.id === Number(value));
           if (selectedVar) {
               const vwp = selectedVar.calculated_wholesale_price > 0 
                    ? selectedVar.calculated_wholesale_price 
                    : (selectedVar.wholesale_sale_price > 0 ? selectedVar.wholesale_sale_price : (selectedVar.wholesale_price > 0 ? selectedVar.wholesale_price : 0));
               updated.price = Number(vwp > 0 ? vwp : (selectedVar.sale_price > 0 ? selectedVar.sale_price : selectedVar.regular_price)) || 0;
               updated.weight = Number(selectedVar.weight_kg) || Number(selectedProd?.weight_kg) || 0;
           } else if (selectedProd) {
               const pwp = selectedProd.calculated_wholesale_price > 0 
                    ? selectedProd.calculated_wholesale_price 
                    : (selectedProd.wholesale_sale_price > 0 ? selectedProd.wholesale_sale_price : (selectedProd.wholesale_price > 0 ? selectedProd.wholesale_price : 0));
               updated.price = Number(pwp > 0 ? pwp : (selectedProd.sale_price > 0 ? selectedProd.sale_price : selectedProd.regular_price)) || 0;
           }
        }

        if (field === 'quantity' || field === 'price' || field === 'product_id' || field === 'variant_id') {
          updated.total = updated.quantity * updated.price;
        }
        return updated;
      }
      return p;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    if (!customer && !isNewCustomer) {
      toast.error("Please select or create a customer.");
      return;
    }

    if (isNewCustomer) {
      if (!newCustomerData.name.trim() || !newCustomerData.phone.trim()) {
        toast.error("Please provide a name and phone number for the new customer.");
        return;
      }
    }
    if (products.length === 0) {
      toast.error("Please add at least one product to the order.");
      return;
    }

    const invalidProduct = products.find(p => (!p.product_id && !p.product_name) || p.price === undefined || p.price === null || isNaN(p.price));
    if (invalidProduct) {
      toast.error("All products must have a valid name and price.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        date,
        office_id: officeId || null,
        customer_id: customer ? customer.id : null,
        name: isNewCustomer ? newCustomerData.name : undefined,
        phone: isNewCustomer ? newCustomerData.phone : undefined,
        address: isNewCustomer ? newCustomerData.address : undefined,
        products: products.map(p => ({
          product_id: p.product_id,
          variant_id: p.variant_id,
          product_name: p.product_name,
          quantity: p.quantity,
          price: p.price
        })),
        payment_type: paymentType,
        payment_account_id: paymentAccountId || null,
        transaction_no: transactionNo,
        sale_amount: saleAmount,
        courier_charge: courierCharge,
        coupon_id: appliedCoupon ? appliedCoupon.id : undefined,
        coupon_code: appliedCoupon ? appliedCoupon.code : undefined,
        discount_amount: appliedCoupon ? appliedCoupon.discount : 0,
        total_amount: totalAmount,
        advance_amount: advanceAmount,
        status,
        courier_name: courierName,
        tracking_id: trackingId,
        note
      };

      const res = await createWholesalerOrder(token, payload);
      if (res.success) {
        setShowSuccessDialog(true);
      } else {
        toast.error("Failed to create order: " + res.message);
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user?.wholesaler_panel_access) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
        You do not have permission to view the wholesaler panel.
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Order</h1>
          <p className="text-gray-500 text-sm">Fill out the new order details</p>
        </div>
        <Link
          href="/dashboard/wholesaler/orders"
          className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition text-sm font-medium shadow-sm"
        >
          <ArrowLeft size={16} /> Back to Orders
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* General Information */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-50 pb-3">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Order Type</label>
              <select disabled className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 text-gray-500">
                <option>Wholesale</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Office</label>
              <select
                value={officeId}
                onChange={(e) => setOfficeId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              >
                <option value="">Select Office</option>
                {/* Normally we'd map offices here if we fetched them */}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Customer</label>
              <div className="flex gap-2">
                 <div className="flex-1">
                     <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={customerOpen}
                          className="w-full justify-between rounded-xl border-gray-200 bg-white hover:bg-gray-50 h-11 font-normal text-gray-700"
                        >
                          {customer
                            ? `${customer.name} - ${customer.phone}`
                            : (isNewCustomer ? "New Customer" : "Select customer...")}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0" align="start">
                        <Command>
                          <CommandInput 
                            placeholder="Search by phone..." 
                            value={phoneSearch}
                            onValueChange={handleSearchCustomer}
                          />
                          <CommandList>
                            <CommandEmpty>No customer found.</CommandEmpty>
                            <CommandGroup>
                              {customerOptions.map((c) => (
                                <CommandItem
                                  key={c.id}
                                  value={c.phone}
                                  onSelect={() => {
                                    setCustomer(c);
                                    setIsNewCustomer(false);
                                    setCustomerOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      customer?.id === c.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {c.name} - {c.phone}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                 </div>
                 <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl h-11 border-primary/20 text-primary hover:bg-primary/5 px-3"
                    onClick={() => {
                      setIsNewCustomer(true);
                      setCustomer(null);
                    }}
                  >
                    <Plus size={18} />
                  </Button>
              </div>

              {isNewCustomer && (
                <div className="mt-4 p-4 border border-primary/20 rounded-xl bg-primary/5 space-y-3">
                  <h3 className="font-semibold text-sm text-primary mb-2">New Customer Details</h3>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newCustomerData.name}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number (11 digits)"
                    value={newCustomerData.phone}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                  />
                  <textarea
                    placeholder="Full Address"
                    value={newCustomerData.address}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, address: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none resize-none"
                    rows={2}
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
                {customer && !isNewCustomer && (
                    <div className="border border-dashed border-primary/30 bg-primary/5 rounded-xl p-5 h-full flex flex-col justify-center">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 min-w-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-primary/20">
                                <UserIcon size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">{customer.name}</h3>
                                <p className="text-sm font-medium text-gray-600 mt-1">{customer.phone}</p>
                                <p className="text-sm text-gray-500 mt-1">{customer.address || 'No address provided'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center border-b border-gray-50 pb-3 mb-4">
            <h2 className="text-lg font-bold text-gray-800">Products</h2>
            <Button
              type="button"
              onClick={addProductRow}
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl h-9 px-4 text-sm"
            >
              <Plus size={16} className="mr-1" /> Add Product
            </Button>
          </div>
          
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 min-w-[250px]">Product</th>
                  <th className="px-4 py-3 min-w-[150px]">Variant</th>
                  <th className="px-4 py-3 w-24">Weight (kg)</th>
                  <th className="px-4 py-3 w-24">Qty</th>
                  <th className="px-4 py-3 w-32">Price</th>
                  <th className="px-4 py-3 w-32">Total</th>
                  <th className="px-4 py-3 w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                      No products added. Click "Add Product" to begin.
                    </td>
                  </tr>
                ) : products.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <Popover open={row.productOpen} onOpenChange={(open) => updateProductRow(row.id, 'productOpen', open)}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between rounded-lg border-gray-200 font-normal h-9 px-3 text-gray-700"
                          >
                            <span className="truncate">
                              {row.product_id
                                ? availableProducts.find(p => p.id === row.product_id)?.name
                                : row.product_name || "Select..."}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search product..." />
                            <CommandList>
                              <CommandEmpty>No product found.</CommandEmpty>
                              <CommandGroup>
                                {availableProducts.map((p) => (
                                  <CommandItem
                                    key={p.id}
                                    value={p.name}
                                    onSelect={() => {
                                      updateProductRow(row.id, 'product_id', p.id);
                                      updateProductRow(row.id, 'productOpen', false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        row.product_id === p.id ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {p.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </td>
                    <td className="px-4 py-3">
                      {row.product_id && availableProducts.find(p => p.id === row.product_id)?.variants?.length > 0 ? (
                         <select 
                           value={row.variant_id || ""}
                           onChange={(e) => updateProductRow(row.id, 'variant_id', Number(e.target.value))}
                           className="w-full border border-gray-200 rounded-lg px-2 py-1.5 h-9 focus:border-primary outline-none"
                         >
                           <option value="">Select Variant</option>
                           {availableProducts.find(p => p.id === row.product_id).variants.map((v: any) => (
                             <option key={v.id} value={v.id}>{v.name}</option>
                           ))}
                         </select>
                      ) : (
                        <span className="text-gray-400 text-xs italic">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                        <input
                          type="number"
                          step="any"
                          value={row.weight || 0}
                          readOnly
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 h-9 bg-gray-50 text-gray-500 text-center"
                        />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="1"
                        value={row.quantity}
                        onChange={(e) => updateProductRow(row.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 h-9 focus:border-primary outline-none text-center"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={row.price}
                        onChange={(e) => updateProductRow(row.id, 'price', parseFloat(e.target.value) || 0)}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 h-9 focus:border-primary outline-none text-right"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 text-right">
                      ৳{row.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => removeProductRow(row.id)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financials & Payment */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-50 pb-3">Financials & Payment</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Type</label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank">Bank</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    {activeStatuses.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              {paymentType === 'bank' && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-blue-800 mb-1">Select Bank Account</label>
                    <select
                      value={paymentAccountId}
                      onChange={(e) => setPaymentAccountId(e.target.value)}
                      className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 outline-none bg-white"
                    >
                      <option value="">-- Select Bank Account --</option>
                      {bankAccounts.map((acc: any) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name} {acc.number ? `- ${acc.number}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-blue-800 mb-1">Transaction No.</label>
                    <input
                      type="text"
                      placeholder="Enter Txn No"
                      value={transactionNo}
                      onChange={(e) => setTransactionNo(e.target.value)}
                      className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:border-blue-400 outline-none bg-white"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 bg-gray-50 border border-gray-100 p-4 rounded-xl">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2 flex items-center gap-1"><Package size={16}/> Select Shipping Rate</label>
                  <select
                    value={shippingRateId}
                    onChange={(e) => setShippingRateId(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:border-primary outline-none bg-white"
                  >
                    <option value="">-- Select Shipping Rate --</option>
                    {shippingRates.map((r: any) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                {shippingRateId && shippingRates.find(r => r.id === Number(shippingRateId))?.is_dhaka_conditional ? (
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">Delivery Zone</label>
                    <select
                      value={deliveryZone}
                      onChange={(e) => setDeliveryZone(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:border-primary outline-none bg-white"
                    >
                      <option value="inside">Inside Dhaka</option>
                      <option value="outside">Outside Dhaka</option>
                    </select>
                  </div>
                ) : <div/>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Note</label>
                <textarea
                  placeholder="Any special notes..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:border-primary outline-none resize-none"
                  rows={2}
                />
              </div>
            </div>

            {/* Financial Summary */}
            <div>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2"><CreditCard size={18} className="text-primary"/> Order Summary</h3>
                  
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-800">৳{saleAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span className="flex items-center gap-1">Total Weight <Info size={14} className="text-gray-400"/></span>
                    <span className="font-semibold text-gray-800">{totalWeight.toFixed(2)} kg</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm border-b border-gray-100 pb-4">
                    <span>Courier Charge <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full ml-1">Auto-calc</span></span>
                    <span className="font-semibold text-primary">৳{courierCharge.toLocaleString()}</span>
                  </div>

                  {/* Coupon Section */}
                  <div className="py-2 border-b border-gray-100">
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Discount Coupon</label>
                    {!appliedCoupon ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-primary outline-none uppercase"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Check size={16} className="text-green-600" />
                          <div>
                            <p className="text-xs font-bold text-green-700">{appliedCoupon.code}</p>
                            <p className="text-[10px] text-green-600">Applied</p>
                          </div>
                        </div>
                        <button type="button" onClick={handleRemoveCoupon} className="text-xs text-red-500 hover:text-red-700 font-semibold underline">
                          Remove
                        </button>
                      </div>
                    )}
                    {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600 text-sm font-semibold">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>- ৳{appliedCoupon.discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-2">
                    <span>Total Amount</span>
                    <span>৳{totalAmount.toLocaleString()}</span>
                  </div>
                  
                  <div className="pt-4 pb-2 border-b border-gray-100">
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Advance Payment Received</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">৳</span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={advanceAmount || ''}
                        onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold text-green-700"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xl font-bold text-red-600 pt-2">
                    <span>Due Amount</span>
                    <span>৳{dueAmount.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-8 bg-primary hover:bg-primary/90 text-white py-6 rounded-xl text-lg font-bold shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
                >
                  {submitting ? "Processing..." : "Create Wholesale Order"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="rounded-2xl border-0 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-green-600 flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                 <Check className="h-6 w-6 text-green-600" />
              </div>
              Order Created Successfully
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 mt-2 text-base">
              The wholesale order has been created. The advance payment (if any) is marked as pending approval.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogAction
              onClick={() => router.push("/dashboard/wholesaler/orders")}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 py-2.5 h-auto font-semibold"
            >
              Go to Orders List
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Dialog */}
      <AlertDialog open={!!errorDialogMessage} onOpenChange={() => setErrorDialogMessage("")}>
        <AlertDialogContent className="rounded-2xl border-0 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                 <Info className="h-6 w-6 text-red-600" />
              </div>
              Submission Failed
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-base">
              {errorDialogMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogAction
              onClick={() => setErrorDialogMessage("")}
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-6 py-2.5 h-auto font-semibold"
            >
              Okay, I'll fix it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
