"use client"

import { randomId } from "@/components/admin/randomId"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { moveItem, useCollection } from "@/components/admin/useCollection"
import {
  AdminLocaleProvider,
  Button,
  Card,
  LocaleTabs,
  LocalizedField,
  MoveButtons,
  SaveBar,
} from "@/components/admin/ui"
import { byOrder, type L } from "@/lib/cms/schema"

const EMPTY: L<string> = { en: "", ja: "", zh: "" }

export default function PhotosPage() {
  const { status, data, dirty, saving, error, setData, save, reload } = useCollection("photos")

  if (status === "loading" || !data) return <p className="py-10 text-sm">読み込み中…</p>

  const items = byOrder(data.items)

  return (
    <AdminLocaleProvider>
      <main>
        <h1 className="mb-1 text-xl font-semibold">写真</h1>
        <p className="mb-4 text-sm text-gray-500 dark:text-white/50">
          自己紹介のカードに出る写真です。上にあるものから順に並びます。
        </p>

        <div className="mb-4">
          <LocaleTabs />
        </div>

        <div className="mb-5">
          <ImageUploader
            kind="photo"
            label="写真を追加"
            onUploaded={(images) =>
              setData((current) => ({
                ...current,
                items: [
                  ...current.items,
                  ...images.map((image, offset) => ({
                    id: randomId(),
                    order: current.items.length + offset,
                    image,
                  })),
                ],
              }))
            }
          />
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item, index) => (
            <li key={item.id}>
              <Card className="p-2">
                {/* 一覧の確認用。next/image を通さず素の img で十分（管理画面のみ） */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image.thumbUrl ?? item.image.url}
                  alt=""
                  className="mb-2 aspect-[4/3] w-full rounded-lg object-cover"
                />

                <LocalizedField
                  label="説明（任意）"
                  value={item.caption ?? EMPTY}
                  onChange={(caption) =>
                    setData((current) => ({
                      ...current,
                      items: current.items.map((photo) =>
                        photo.id === item.id ? { ...photo, caption } : photo,
                      ),
                    }))
                  }
                />

                <div className="mt-2 flex items-center justify-between">
                  <MoveButtons
                    index={index}
                    count={items.length}
                    onMove={(from, to) =>
                      setData((current) => ({ ...current, items: moveItem(byOrder(current.items), from, to) }))
                    }
                  />
                  <Button
                    variant="danger"
                    className="min-h-9 px-3"
                    onClick={() =>
                      setData((current) => ({
                        ...current,
                        items: byOrder(current.items)
                          .filter((photo) => photo.id !== item.id)
                          .map((photo, order) => ({ ...photo, order })),
                      }))
                    }
                  >
                    削除
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>

        <SaveBar dirty={dirty} saving={saving} error={error} onSave={() => void save()} onReload={() => void reload()} />
      </main>
    </AdminLocaleProvider>
  )
}
