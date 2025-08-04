import DevelopmentCardComponent from "./DevelopmentCard"
import EmptyCardSlot from "./EmptyCardSlot"

const CardSlot = ({
  card,
  tier,
  canBuy,
  onBuy,
  onReserve,
  showActions,
  animatingCardId,
  isReserved,
  index,
}: {
  card: any
  tier?: string
  canBuy: boolean
  onBuy: () => void
  onReserve?: () => void
  showActions?: boolean
  animatingCardId: number | null
  isReserved?: boolean
  index: number
}) => {
  if (!card) {
    return <EmptyCardSlot key={`empty-${tier}-${index}`} />
  }
  return (
    <DevelopmentCardComponent
      key={card.id}
      card={card}
      tier={tier}
      canBuy={canBuy}
      onBuy={onBuy}
      onReserve={onReserve}
      showActions={showActions}
      animatingCardId={animatingCardId}
      isReserved={isReserved}
    />
  )
}

export default CardSlot