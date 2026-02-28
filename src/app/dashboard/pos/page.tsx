import { getProducts } from "@/app/actions/products";
import POSSystem from "@/components/POSSystem";

export default async function POSPage() {
    // Carga inicial de productos para el POS
    const { products = [] } = await getProducts();

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Punto de Venta</h1>
                <p className="text-sm text-slate-500 font-medium">Gestiona ventas multilínea de forma ágil.</p>
            </div>

            <POSSystem initialProducts={products} />
        </div>
    );
}
