'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContactActionButtons from "@/components/shop/ContactActionButtons";

interface ProductTabsProps {
  productName: string;
  description: string | null;
  shortDescription: string | null;
  sku: string | null;
  productType: string | null;
  categoryName: string | undefined;
  brandName: string | undefined;
}

const ProductTabs = ({
  productName,
  description,
  shortDescription,
  sku,
  productType,
  categoryName,
  brandName,
}: ProductTabsProps) => {
  return (
    <div className="mb-12 md:mb-16">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto md:h-14 p-0 bg-transparent flex-wrap gap-1">
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 md:px-6 h-full text-sm md:text-base transition-all"
          >
            Description
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6 md:mt-8">
          <div className="prose max-w-none text-editor-content">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
              {productName}
            </h3>

            {description ? (
              <div
                className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <div className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                <p>{shortDescription || 'No description available.'}</p>
              </div>
            )}
          </div>

          {/* Contact Buttons */}
          <ContactActionButtons />
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default ProductTabs;
