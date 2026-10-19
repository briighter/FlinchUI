'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { RadioGroup } from '@/components/ui/radio-group';
import { Stepper } from '@/components/ui/stepper';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  CheckIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  StarIcon,
  UserIcon,
} from '@/components/ui/icons';
import { PhoneSheet, ProductPlate } from '../lib/phone-sheet';

/* ----------------------------------- data ---------------------------------- */

interface Product {
  id: string;
  name: string;
  maker: string;
  price: number;
  compareAt?: number;
  gradient: string;
  category: 'Tableware' | 'Drinkware' | 'Vessels' | 'Kitchen';
  note: string;
  detail: string;
  stock: 'in' | 'low' | 'made-to-order';
  rating: number;
  reviews: number;
}

const PRODUCTS: Product[] = [
  {
    id: 'ridgeline-plate',
    name: 'Ridgeline Dinner Plate',
    maker: 'Ilse Marrow',
    price: 38,
    gradient: 'from-neutral-300 to-neutral-500',
    category: 'Tableware',
    note: 'Wheel-thrown, iron-speckled stoneware',
    detail:
      'Thrown in one pull and trimmed on the second day, then fired to cone 6 in reduction. The iron speckle comes from the clay body itself — no glaze on the foot.',
    stock: 'in',
    rating: 4.8,
    reviews: 42,
  },
  {
    id: 'kiln-mug',
    name: 'Kiln Mug — Ash Glaze',
    maker: 'Ilse Marrow',
    price: 32,
    gradient: 'from-neutral-200 to-neutral-400',
    category: 'Drinkware',
    note: '10 oz, pulled handle, wood-ash glaze',
    detail:
      'A daily mug with a pulled handle that sits under three fingers. The ash glaze is mixed from the kiln’s own sweepings, so no two runs match exactly.',
    stock: 'low',
    rating: 4.9,
    reviews: 118,
  },
  {
    id: 'shino-bowl',
    name: 'Shino Serving Bowl',
    maker: 'Rowan Pike',
    price: 64,
    gradient: 'from-neutral-300 via-neutral-400 to-brand-300',
    category: 'Tableware',
    note: '12 in, feldspar shino, orange-peel surface',
    detail:
      'Shino is a fussy glaze: thick, crawling, and prone to pinholing. This one broke right — a matte orange-peel surface that warms as it holds heat.',
    stock: 'in',
    rating: 4.7,
    reviews: 29,
  },
  {
    id: 'cobalt-carafe',
    name: 'Cobalt Carafe',
    maker: 'Ilse Marrow',
    price: 88,
    gradient: 'from-neutral-400 to-neutral-600',
    category: 'Drinkware',
    note: '40 oz, cobalt slip, wax-resist banding',
    detail:
      'Banded with wax resist and dipped three times in cobalt slip. The lip is ground flat after firing so it pours without dribbling.',
    stock: 'made-to-order',
    rating: 4.6,
    reviews: 17,
  },
  {
    id: 'vase-no-7',
    name: 'Wheel-Thrown Vase No. 7',
    maker: 'Rowan Pike',
    price: 142,
    gradient: 'from-neutral-300 to-neutral-500',
    category: 'Vessels',
    note: 'One of one, 14 in, matte black body',
    detail:
      'A single-session throw with a collapsed shoulder line we decided to keep. Signed and numbered on the foot ring.',
    stock: 'low',
    rating: 5,
    reviews: 6,
  },
  {
    id: 'butter-keeper',
    name: 'Stoneware Butter Keeper',
    maker: 'Ilse Marrow',
    price: 46,
    gradient: 'from-neutral-200 to-neutral-300',
    category: 'Kitchen',
    note: 'Bell lid, water seal, unglazed interior',
    detail:
      'The interior stays unglazed so it holds the water seal overnight. Bell lid is thrown to a 1 mm wall to keep the weight down.',
    stock: 'in',
    rating: 4.5,
    reviews: 54,
  },
];

const CATEGORIES = ['All', 'Tableware', 'Drinkware', 'Vessels', 'Kitchen'] as const;

const STOCK_COPY: Record<Product['stock'], { label: string; tone: 'success' | 'warning' | 'info' }> = {
  in: { label: 'In stock', tone: 'success' },
  low: { label: 'Low stock', tone: 'warning' },
  'made-to-order': { label: 'Made to order', tone: 'info' },
};

/* ---------------------------------- app ------------------------------------ */

type View = 'shop' | 'checkout' | 'confirmed';

export function Storefront() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [openProduct, setOpenProduct] = useState<Product | null>(null);
  const [bagOpen, setBagOpen] = useState(false);
  const [bag, setBag] = useState<Record<string, number>>({ 'kiln-mug': 2, 'ridgeline-plate': 1 });
  const [size, setSize] = useState('regular');
  const [view, setView] = useState<View>('shop');
  const [saved, setSaved] = useState<string[]>(['cobalt-carafe']);

  const lines = useMemo(
    () =>
      Object.entries(bag)
        .map(([id, quantity]) => ({ product: PRODUCTS.find((item) => item.id === id)!, quantity }))
        .filter((line) => line.product),
    [bag],
  );

  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const bagCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const shipping = subtotal > 120 || subtotal === 0 ? 0 : 9;

  const visible = category === 'All' ? PRODUCTS : PRODUCTS.filter((item) => item.category === category);

  function addToBag(product: Product, quantity = 1) {
    setBag((previous) => ({ ...previous, [product.id]: (previous[product.id] ?? 0) + quantity }));
    setOpenProduct(null);
  }

  function setQuantity(id: string, quantity: number) {
    setBag((previous) => {
      const next = { ...previous };
      if (quantity <= 0) delete next[id];
      else next[id] = quantity;
      return next;
    });
  }

  /* ------------------------------- confirmation ------------------------------ */
  if (view === 'confirmed') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-bg px-8 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-success-subtle text-success-fg">
          <CheckCircleIcon className="size-7" />
        </span>
        <div>
          <h1 className="text-lg font-semibold text-fg">Order confirmed</h1>
          <p className="mt-1.5 text-sm leading-6 text-fg-muted">
            Order <span className="font-mono text-fg">MR-24817</span> is with the studio. Ridgeline
            pieces ship Tuesday, made-to-order items in three weeks.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            setBag({});
            setView('shop');
          }}
        >
          Back to the shop
        </Button>
      </div>
    );
  }

  /* -------------------------------- checkout -------------------------------- */
  if (view === 'checkout') {
    return (
      <div className="flex h-full flex-col bg-bg">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
          <IconButton label="Back to bag" size="sm" variant="ghost" onClick={() => setView('shop')}>
            <ArrowLeftIcon />
          </IconButton>
          <span className="text-sm font-semibold text-fg">Checkout</span>
          <Badge tone="neutral" size="sm" className="ml-auto">
            {bagCount} items
          </Badge>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <Stepper
            current={1}
            steps={[
              { label: 'Bag', status: 'complete' },
              { label: 'Details', status: 'current' },
              { label: 'Payment', status: 'upcoming' },
            ]}
          />

          <div className="mt-6 flex flex-col gap-4">
            <fieldset className="flex flex-col gap-3">
              <legend className="text-xs font-semibold tracking-wide text-fg-subtle uppercase">
                Shipping
              </legend>
              {[
                { id: 'ship-name', label: 'Full name', value: 'Dana Whitlock' },
                { id: 'ship-email', label: 'Email', value: 'dana@whitlock.studio' },
                { id: 'ship-address', label: 'Address', value: '18 Rope Walk, Portland, OR 97209' },
              ].map((field) => (
                <FormField key={field.id} label={field.label} htmlFor={field.id}>
                  <Input id={field.id} defaultValue={field.value} />
                </FormField>
              ))}
            </fieldset>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-fg-muted">Delivery notes</span>
              <Textarea rows={3} placeholder="Leave with the neighbour at number 20" />
            </label>

            <Card variant="subtle" padding="sm">
              <dl className="flex flex-col gap-2 text-sm">
                {[
                  ['Subtotal', formatCurrency(subtotal)],
                  ['Shipping', shipping === 0 ? 'Free' : formatCurrency(shipping)],
                  ['Tax', formatCurrency(subtotal * 0.084)],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between">
                    <dt className="text-fg-muted">{label}</dt>
                    <dd className="tabular-nums text-fg">{value}</dd>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-border pt-2 font-semibold">
                  <dt className="text-fg">Total</dt>
                  <dd className="tabular-nums text-fg">
                    {formatCurrency(subtotal + shipping + subtotal * 0.084)}
                  </dd>
                </div>
              </dl>
            </Card>
          </div>
        </div>

        <div className="shrink-0 border-t border-border bg-surface p-4">
          <Button fullWidth size="lg" onClick={() => setView('confirmed')}>
            Pay {formatCurrency(subtotal + shipping + subtotal * 0.084)}
          </Button>
        </div>
      </div>
    );
  }

  /* ---------------------------------- shop ---------------------------------- */
  return (
    <div className="relative flex h-full flex-col bg-bg">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
        <span className="text-base font-semibold tracking-tight text-fg">
          Marrow
          <span className="text-fg-subtle"> supply</span>
        </span>
        <span className="ml-auto flex items-center gap-1">
          <IconButton label="Search the shop" size="sm" variant="ghost">
            <SearchIcon />
          </IconButton>
          <button
            type="button"
            onClick={() => setBagOpen(true)}
            className="relative inline-flex size-9 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg"
            aria-label={`Bag, ${bagCount} items`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 8h12l-1 12H7L6 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            {bagCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-fg-on-brand">
                {bagCount}
              </span>
            ) : null}
          </button>
        </span>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex gap-2 overflow-x-auto px-4 py-3">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                category === item
                  ? 'border-transparent bg-fg text-bg'
                  : 'border-border text-fg-muted hover:border-border-strong hover:text-fg',
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="px-4">
          <Card className="overflow-hidden border-none bg-transparent" variant="ghost">
            <ProductPlate gradient="from-neutral-400 via-neutral-500 to-neutral-700" className="rounded-xl">
              <AspectRatio ratio={16 / 10} className="flex items-end p-4">
                <div className="relative">
                  <Badge tone="brand" size="sm">
                    New run
                  </Badge>
                  <h1 className="mt-2 max-w-[15rem] text-lg font-semibold leading-6 text-neutral-0">
                    Autumn firing, 42 pieces from the kiln
                  </h1>
                  <p className="mt-1 text-xs text-neutral-0/80">Ash, shino, and cobalt glazes</p>
                </div>
              </AspectRatio>
            </ProductPlate>
          </Card>
        </div>

        <div className="flex items-center justify-between px-4 pb-2 pt-5">
          <h2 className="text-sm font-semibold text-fg">All pieces</h2>
          <span className="text-xs text-fg-subtle">{visible.length} of {PRODUCTS.length}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 px-4 pb-6">
          {visible.map((product) => {
            const stock = STOCK_COPY[product.stock];
            const isSaved = saved.includes(product.id);
            return (
              <div key={product.id} className="relative flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setOpenProduct(product)}
                  className="flex flex-col gap-2 text-left"
                >
                  <ProductPlate gradient={product.gradient} className="w-full rounded-lg">
                    <AspectRatio ratio={1}>
                      {product.stock !== 'in' ? (
                        <span className="absolute bottom-2 left-2">
                          <Badge tone={stock.tone} size="sm">
                            {stock.label}
                          </Badge>
                        </span>
                      ) : null}
                    </AspectRatio>
                  </ProductPlate>

                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium leading-5 text-fg">{product.name}</p>
                    <p className="text-[11px] text-fg-subtle">{product.maker}</p>
                    <span className="mt-0.5 flex items-center gap-2">
                      <span className="text-sm font-semibold tabular-nums text-fg">
                        {formatCurrency(product.price, true)}
                      </span>
                      <span className="flex items-center gap-0.5 text-[11px] text-fg-subtle">
                        <StarIcon className="size-3 fill-current text-warning" />
                        {product.rating}
                      </span>
                    </span>
                  </div>
                </button>

                <span className="absolute right-1.5 top-1.5">
                  <IconButton
                    label={isSaved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
                    size="sm"
                    variant="ghost"
                    className="backdrop-blur-sm"
                    onClick={() =>
                      setSaved((previous) =>
                        previous.includes(product.id)
                          ? previous.filter((id) => id !== product.id)
                          : [...previous, product.id],
                      )
                    }
                  >
                    <HeartIcon className={cn(isSaved && 'fill-current text-danger')} />
                  </IconButton>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <nav aria-label="Shop sections" className="flex h-14 shrink-0 items-center border-t border-border bg-surface px-2">
        {[
          { label: 'Shop', icon: 'shop' },
          { label: 'Search', icon: 'search' },
          { label: 'Saved', icon: 'saved' },
          { label: 'Account', icon: 'user' },
        ].map((tab, index) => (
          <button
            key={tab.label}
            type="button"
            aria-current={index === 0 ? 'page' : undefined}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-medium transition-colors',
              index === 0 ? 'text-brand-600' : 'text-fg-subtle hover:text-fg',
            )}
          >
            {tab.icon === 'saved' ? (
              <HeartIcon className="size-5" />
            ) : tab.icon === 'search' ? (
              <SearchIcon className="size-5" />
            ) : tab.icon === 'user' ? (
              <UserIcon className="size-5" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h10" />
              </svg>
            )}
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Product sheet */}
      <PhoneSheet
        open={openProduct !== null}
        onClose={() => setOpenProduct(null)}
        title={openProduct?.name}
        size="tall"
      >
        {openProduct ? (
          <div className="flex flex-col gap-4">
            <ProductPlate gradient={openProduct.gradient} className="-mx-4 -mt-4 h-44">
              <span className="absolute bottom-3 left-4">
                <Badge tone={STOCK_COPY[openProduct.stock].tone} size="sm">
                  {STOCK_COPY[openProduct.stock].label}
                </Badge>
              </span>
            </ProductPlate>

            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-fg">{formatCurrency(openProduct.price, true)}</p>
                <p className="mt-0.5 text-xs text-fg-subtle">
                  {openProduct.maker} · {openProduct.note}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs text-fg-muted">
                <StarIcon className="size-3 fill-current text-warning" />
                {openProduct.rating}
                <span className="text-fg-subtle">({openProduct.reviews})</span>
              </span>
            </div>

            <p className="text-sm leading-6 text-fg-muted">{openProduct.detail}</p>

            <RadioGroup
              name="size"
              value={size}
              onValueChange={setSize}
              orientation="horizontal"
              options={[
                { label: 'Petite', value: 'petite' },
                { label: 'Regular', value: 'regular' },
                { label: 'Grand', value: 'grand' },
              ]}
            />

            <ul className="flex flex-col gap-2 rounded-lg border border-border p-3 text-xs text-fg-muted">
              {[
                'Fired to cone 6 in reduction',
                'Dishwasher safe, though hand-washing keeps the glaze bright',
                'Ships in moulded pulp, no plastic',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-success-fg" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-5">
          <Button fullWidth size="lg" onClick={() => openProduct && addToBag(openProduct)}>
            Add to bag
          </Button>
        </div>
      </PhoneSheet>

      {/* Bag sheet */}
      <PhoneSheet open={bagOpen} onClose={() => setBagOpen(false)} title="Your bag" size="tall">
        {lines.length === 0 ? (
          <p className="py-10 text-center text-sm text-fg-subtle">Your bag is empty.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {lines.map((line) => (
              <div key={line.product.id} className="flex gap-3">
                <ProductPlate gradient={line.product.gradient} className="size-16 shrink-0 rounded-lg" />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="truncate text-sm font-medium text-fg">{line.product.name}</p>
                  <p className="text-xs text-fg-subtle">{formatCurrency(line.product.price, true)} each</p>
                  <div className="mt-auto flex items-center gap-2">
                    <div className="flex items-center rounded-md border border-border">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${line.product.name}`}
                        onClick={() => setQuantity(line.product.id, line.quantity - 1)}
                        className="inline-flex size-7 items-center justify-center text-fg-muted hover:text-fg"
                      >
                        <MinusIcon className="size-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm tabular-nums text-fg">{line.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${line.product.name}`}
                        onClick={() => setQuantity(line.product.id, line.quantity + 1)}
                        className="inline-flex size-7 items-center justify-center text-fg-muted hover:text-fg"
                      >
                        <PlusIcon className="size-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuantity(line.product.id, 0)}
                      className="text-xs text-fg-subtle underline-offset-4 hover:text-danger-fg hover:underline"
                    >
                      Remove
                    </button>
                    <span className="ml-auto text-sm font-medium tabular-nums text-fg">
                      {formatCurrency(line.product.price * line.quantity, true)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <dl className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-fg-muted">Subtotal</dt>
                <dd className="tabular-nums text-fg">{formatCurrency(subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-fg-muted">Shipping</dt>
                <dd className="tabular-nums text-fg">
                  {shipping === 0 ? 'Free over $120' : formatCurrency(shipping)}
                </dd>
              </div>
            </dl>

            <Button fullWidth size="lg" onClick={() => { setBagOpen(false); setView('checkout'); }}>
              Checkout · {formatCurrency(subtotal + shipping)}
            </Button>
          </div>
        )}
      </PhoneSheet>
    </div>
  );
}
