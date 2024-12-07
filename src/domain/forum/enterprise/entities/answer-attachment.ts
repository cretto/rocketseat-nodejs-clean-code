import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface AnswerAttachmentProps {
  aswerId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  get aswerId() {
    return this.props.aswerId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: AnswerAttachment, id?: UniqueEntityID) {
    const attachment = new AnswerAttachment(props, id)

    return attachment
  }
}
