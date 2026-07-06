import ProductDetails from "@/src/views/Product/ProductDetails";

export async function generateStaticParams() {
  try {
    const res = await fetch('https://firestore.googleapis.com/v1/projects/dheeran-crackers/databases/(default)/documents/products?pageSize=1000');
    if (!res.ok) throw new Error('Failed to fetch from Firestore REST API');
    
    const data = await res.json();
    const params = [];
    
    if (data.documents) {
      data.documents.forEach((doc: any) => {
        const id = doc.name.split('/').pop();
        if (id) params.push({ id });
        
        const slug = doc.fields?.slug?.stringValue;
        if (slug && slug !== id) {
          params.push({ id: slug });
        }
      });
    }
    
    return params;
  } catch (error) {
    console.error('Failed to fetch products for static generation:', error);
    return [];
  }
}

export default function Page() { 
  return <ProductDetails />; 
}
