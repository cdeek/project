'use client'

import React, { Fragment } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { LoadingShimmer } from '@/components/LoadingShimmer'
import { useCart } from '@/app/_providers/Cart' 

const CartPage = () => {
  const { cart, cartIsEmpty, addItemToCart, cartTotal, hasInitializedCart, deleteItemFromCart } = useCart()

  return (
    <Fragment>
      <br />
      {!hasInitializedCart ? (
        <div className={classes.loading}>
          <LoadingShimmer />
        </div>
      ) : (
        <Fragment>
          {cartIsEmpty ? (
            <div className="text-bold">
              Your cart is empty.
              <Fragment>
                  {' '}
                  <Link href="/">Click here</Link>
                  {` to shop.`}
              </Fragment>
            </div>
          ) : (
            <div className="">
              <div className="mb-4">
                {`There ${cart?.items?.length === 1 ? 'is' : 'are'} ${cart?.items?.length} item${
                  cart?.items?.length === 1 ? '' : 's'
                } in your cart.`}
              </div>
              {cart?.items?.map((item, index) => {
                if (typeof item.product === 'object') {
                  const {
                    quantity,
                    product,
                    product: { id, title, meta, price },
                  } = item

                  const isLast = index === (cart?.items?.length || 0) - 1

                  const metaImage = meta?.image

                  return (
                    <Fragment key={index}>
                      <div className="flex flex-start m-0">
                        <Link href={`/products/${product._id}`} className={classes.mediaWrapper}>
                          {!metaImage && <span className="">No image</span>}
                          {metaImage && typeof metaImage !== 'string' && (
                            <Image
                              className=""
                              src={metaImage}
                              fill
                            />
                          )}
                        </Link>
                        <div className={classes.rowContent}>
                          <h5 className={classes.title}>
                            <Link href={`/products/${product._id}`} className={classes.titleLink}>
                              {title}
                            </Link>
                          </h5>
                          <div className={classes.actions}>
                            <label>
                              Quantity &nbsp;
                              <input
                                type="number"
                                className=""
                                // fallback to empty string to avoid uncontrolled input error
                                // this allows the user to user their backspace key to clear the input
                                value={typeof quantity === 'number' ? quantity : ''}
                                onChange={e => {
                                  addItemToCart({
                                    product,
                                    quantity: Number(e.target.value),
                                  })
                                }}
                              />
                            </label>
                            <button onClick={deleteItemFromCart(product)}>Remove</button>
                          </div>
                          <small>{price * quantity}</small>
                        </div>
                      </div>
                      {!isLast && <HR />}
                    </Fragment>
                  )
                }
                return null
              })}
              <hr />
              <h5 className={classes.cartTotal}>{`Total: ${cartTotal.formatted}`}</h5>
              <Link
                className={classes.checkoutButton}
                href="/checkout"
              >
                Checkout
              </Link>
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  )
}

export default CartPage;
