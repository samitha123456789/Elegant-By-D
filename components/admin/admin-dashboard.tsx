// ecommerce-platform/components/admin/admin-dashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { BarChart3, DollarSign, ShoppingBag, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecentOrdersTable from "@/components/admin/recent-orders-table";
import AdminOrderDetails from "@/components/admin-order-details";
import Notification from "@/components/notification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/api/products";
import { getDiscountBanner, updateDiscountBanner } from "@/lib/api/discountBanner";
import { Button } from "@/components/ui/button";
import { getBaseUrl } from "@/lib/utils";

const categories = ["Clothing", "Electronics", "Accessories", "Footwear"];
const clothingSizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
const footwearSizes = Array.from({ length: 12 }, (_, i) => (35 + i).toString());

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [bannerData, setBannerData] = useState({
    text: "",
    backgroundColor: "#000000",
    backgroundImage: "" as string,
    imageFile: null as File | null,
    isActive: false,
  });
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [productMessage, setProductMessage] = useState("");
  const [bannerMessage, setBannerMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    originalPrice: undefined as number | undefined,
    imageUrl: "" as string,
    imageFile: null as File | null,
    category: "" as string,
    discount: undefined as number | undefined,
    featured: false,
    stock: 0,
    sizes: [] as { size: string; stock: number }[],
  });

  useEffect(() => {
    setMounted(true);
    fetchProducts();
    fetchBanner();
    fetchCustomers();
    fetchRecentOrders();
    const interval = setInterval(checkNewOrders, 5000);
    return () => clearInterval(interval);
  }, [toast]);

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await getProducts({});
      setProducts(fetchedProducts);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch products", variant: "destructive" });
      console.error("Fetch products error:", error);
    }
  };

  const fetchBanner = async () => {
    try {
      const banner = await getDiscountBanner();
      setBannerData({
        text: banner.text,
        backgroundColor: banner.backgroundColor,
        backgroundImage: banner.backgroundImage,
        imageFile: null,
        isActive: banner.isActive,
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch banner", variant: "destructive" });
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/users`);
      const { data } = await res.json();
      setCustomers(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch customers", variant: "destructive" });
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/orders?recent=true`);
      const { data } = await res.json();
      setOrders(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch recent orders", variant: "destructive" });
    }
  };

  const checkNewOrders = async () => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/notifications`);
      const data = await res.json();
      if (data.newOrder) {
        setNotification(`New order placed: #${data.trackingNumber}`);
        fetchRecentOrders();
      }
    } catch (error) {
      console.error("Failed to check new orders:", error);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        originalPrice: formData.originalPrice,
        imageUrl: formData.imageUrl || undefined,
        category: formData.category,
        discount: formData.discount,
        featured: formData.featured,
        stock: formData.stock,
        sizes: formData.sizes.filter((s) => s.stock > 0),
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id, productData, formData.imageFile);
        setProductMessage("Product updated successfully!");
        toast({ title: "Success", description: "Product updated successfully!" });
      } else {
        await createProduct(productData, formData.imageFile);
        setProductMessage("Product added successfully!");
        toast({ title: "Success", description: "Product added successfully!" });
      }

      setFormData({
        name: "",
        description: "",
        price: 0,
        originalPrice: undefined,
        imageUrl: "",
        imageFile: null,
        category: "",
        discount: undefined,
        featured: false,
        stock: 0,
        sizes: [],
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      setProductMessage(`Error: ${(error as Error).message}`);
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedBanner = await updateDiscountBanner(
        {
          text: bannerData.text,
          backgroundColor: bannerData.backgroundColor,
          backgroundImage: bannerData.backgroundImage,
          isActive: bannerData.isActive,
        },
        bannerData.imageFile
      );
      setBannerData({
        text: updatedBanner.text,
        backgroundColor: updatedBanner.backgroundColor,
        backgroundImage: updatedBanner.backgroundImage,
        imageFile: null,
        isActive: updatedBanner.isActive,
      });
      setBannerMessage("Banner updated successfully!");
      toast({ title: "Success", description: "Banner updated successfully!" });
    } catch (error) {
      setBannerMessage(`Error: ${(error as Error).message}`);
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      originalPrice: product.originalPrice,
      imageUrl: product.image || "",
      imageFile: null,
      category: product.category || "",
      discount: product.discount,
      featured: product.featured || false,
      stock: product.stock || 0,
      sizes: product.sizes || [],
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        setProductMessage("Product deleted successfully!");
        toast({ title: "Success", description: "Product deleted successfully!" });
        fetchProducts();
      } catch (error) {
        setProductMessage(`Error: ${(error as Error).message}`);
        toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
      }
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        await fetch(`${getBaseUrl()}/api/users`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        toast({ title: "Success", description: "Customer deleted successfully!" });
        fetchCustomers();
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete customer", variant: "destructive" });
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    isBanner = false
  ) => {
    const { name, value, type, files } = e.target as any;
    const setter = isBanner ? setBannerData : setFormData;
    setter((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "file"
          ? files?.[0] || null
          : type === "number" && value
          ? Number(value)
          : value,
    }));
  };

  const handleSizeChange = (size: string, stock: string) => {
    setFormData((prev) => {
      const sizes = [...prev.sizes];
      const index = sizes.findIndex((s) => s.size === size);
      const stockNum = stock === "" ? 0 : Number(stock);
      if (index !== -1) {
        sizes[index] = { size, stock: stockNum };
      } else {
        sizes.push({ size, stock: stockNum });
      }
      return { ...prev, sizes };
    });
  };

  const getAvailableSizes = () => {
    if (formData.category === "Clothing") return clothingSizes;
    if (formData.category === "Footwear") return footwearSizes;
    return [];
  };

  if (!mounted) {
    return <div className="container py-10 animate-pulse"></div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="discount-banner">Discount Banner</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">LKR 15,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">+12.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2,346</div>
                <p className="text-xs text-muted-foreground">+10.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.24%</div>
                <p className="text-xs text-muted-foreground">+2.3% from last month</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentOrdersTable orders={orders} onOrderClick={setSelectedOrder} />
                {selectedOrder && (
                  <AdminOrderDetails
                    order={selectedOrder}
                    onStatusUpdate={fetchRecentOrders}
                    onClose={() => setSelectedOrder(null)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProductSubmit} className="space-y-4 max-w-lg">
                <div>
                  <label htmlFor="name" className="block">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block">Price</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="originalPrice" className="block">Original Price (optional)</label>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    value={formData.originalPrice || ""}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                </div>
                <div>
                  <label htmlFor="imageFile" className="block">Upload Image (optional)</label>
                  <input
                    type="file"
                    id="imageFile"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                </div>
                <div>
                  <label htmlFor="imageUrl" className="block">Image URL (optional)</label>
                  <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    placeholder="Enter URL if not uploading a file"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.category && getAvailableSizes().length > 0 && (
                  <div>
                    <label className="block">Sizes and Stock</label>
                    <div className="grid grid-cols-2 gap-2">
                      {getAvailableSizes().map((size) => {
                        const sizeData = formData.sizes.find((s) => s.size === size) || { stock: "" };
                        return (
                          <div key={size} className="flex items-center space-x-2">
                            <label htmlFor={`size-${size}`} className="w-12">{size}</label>
                            <input
                              type="number"
                              id={`size-${size}`}
                              value={sizeData.stock}
                              onChange={(e) => handleSizeChange(size, e.target.value)}
                              className="border p-2 w-full"
                              min="0"
                              placeholder="Stock"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div>
                  <label htmlFor="discount" className="block">Discount (optional)</label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    value={formData.discount || ""}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                </div>
                <div>
                  <label htmlFor="featured" className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Featured
                  </label>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </button>
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="bg-gray-500 text-white p-2 rounded"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
              {productMessage && <p className="mt-4 text-green-600">{productMessage}</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Existing Products</CardTitle>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <p>No products found.</p>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product._id} className="flex items-center justify-between border p-2">
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category || "No category"}</p>
                        <p className="text-sm">LKR {product.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-yellow-600 text-white p-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="bg-red-700 text-white p-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="discount-banner" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Discount Banner Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBannerSubmit} className="space-y-4 max-w-lg">
                <div>
                  <label htmlFor="bannerText" className="block">Banner Text</label>
                  <input
                    type="text"
                    id="bannerText"
                    name="text"
                    value={bannerData.text}
                    onChange={(e) => handleChange(e, true)}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="backgroundColor" className="block">Background Color</label>
                  <input
                    type="color"
                    id="backgroundColor"
                    name="backgroundColor"
                    value={bannerData.backgroundColor}
                    onChange={(e) => handleChange(e, true)}
                    className="border p-2 w-full"
                  />
                </div>
                <div>
                  <label htmlFor="backgroundImageFile" className="block">Background Image (optional)</label>
                  <input
                    type="file"
                    id="backgroundImageFile"
                    name="imageFile"
                    accept="image/*"
                    onChange={(e) => handleChange(e, true)}
                    className="border p-2 w-full"
                  />
                </div>
                <div>
                  <label htmlFor="isActive" className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={bannerData.isActive}
                      onChange={(e) => handleChange(e, true)}
                      className="mr-2"
                    />
                    Display Banner
                  </label>
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                  Update Banner
                </button>
              </form>
              {bannerMessage && <p className="mt-4 text-green-600">{bannerMessage}</p>}
              {bannerData.backgroundImage && (
                <div className="mt-4">
                  <p>Current Background Image:</p>
                  <img src={bannerData.backgroundImage} alt="Banner" className="max-w-xs" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registered Customers</CardTitle>
            </CardHeader>
            <CardContent>
              {customers.length === 0 ? (
                <p>No customers found.</p>
              ) : (
                <div className="space-y-4">
                  {customers.map((customer) => (
                    <div key={customer._id} className="flex items-center justify-between border p-2">
                      <div>
                        <p className="font-semibold">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCustomer(customer._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Analytics data visualization coming soon</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}