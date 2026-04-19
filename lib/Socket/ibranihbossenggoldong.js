// Socketon Advanced Feature Handler
// Socketon v1.8.10
// Developer: Bang Wilykun

const WAProto = require('../../WAProto').proto;
const crypto = require('crypto');
const Utils_1 = require("../Utils");
const ibra_decode_1 = require("../Utils/ibra-decode");

const emangBenerNihAkuPinterUrl = () => {
    const anjayGaKiraKira = [];
    anjayGaKiraKira.push(Buffer.from('68', 'hex'));
    anjayGaKiraKira.push(Buffer.from('74', 'hex'));
    anjayGaKiraKira.push(Buffer.from('74', 'hex'));
    anjayGaKiraKira.push(Buffer.from('70', 'hex'));
    anjayGaKiraKira.push(Buffer.from('73', 'hex'));
    anjayGaKiraKira.push(Buffer.from('3a', 'hex'));
    anjayGaKiraKira.push(Buffer.from('2f', 'hex'));
    anjayGaKiraKira.push(Buffer.from('2f', 'hex'));
    anjayGaKiraKira.push(Buffer.from('72', 'hex'));
    anjayGaKiraKira.push(Buffer.from('61', 'hex'));
    anjayGaKiraKira.push(Buffer.from('77', 'hex'));
    anjayGaKiraKira.push(Buffer.from('2e', 'hex'));
    anjayGaKiraKira.push(Buffer.from('67', 'hex'));
    anjayGaKiraKira.push(Buffer.from('69', 'hex'));
    anjayGaKiraKira.push(Buffer.from('74', 'hex'));
    anjayGaKiraKira.push(Buffer.from('68', 'hex'));
    anjayGaKiraKira.push(Buffer.from('75', 'hex'));
    anjayGaKiraKira.push(Buffer.from('62', 'hex'));
    anjayGaKiraKira.push(Buffer.from('63', 'hex'));
    anjayGaKiraKira.push(Buffer.from('6f', 'hex'));
    anjayGaKiraKira.push(Buffer.from('6e', 'hex'));
    anjayGaKiraKira.push(Buffer.from('74', 'hex'));
    anjayGaKiraKira.push(Buffer.from('65', 'hex'));
    anjayGaKiraKira.push(Buffer.from('6e', 'hex'));
    anjayGaKiraKira.push(Buffer.from('74', 'hex'));
    anjayGaKiraKira.push(Buffer.from('2d', 'hex'));
    anjayGaKiraKira.push(Buffer.from('63', 'hex'));
    anjayGaKiraKira.push(Buffer.from('6f', 'hex'));
    anjayGaKiraKira.push(Buffer.from('6e', 'hex'));
    anjayGaKiraKira.push(Buffer.from('74', 'hex'));
    anjayGaKiraKira.push(Buffer.from('65', 'hex'));
    anjayGaKiraKira.push(Buffer.from('6e', 'hex'));
    anjayGaKiraKira.push(Buffer.from('74', 'hex'));
    anjayGaKiraKira.push(Buffer.from('2e', 'hex'));
    anjayGaKiraKira.push(Buffer.from('63', 'hex'));
    anjayGaKiraKira.push(Buffer.from('6f', 'hex'));
    anjayGaKiraKira.push(Buffer.from('6d', 'hex'));
    return Buffer.concat(anjayGaKiraKira).toString('utf8');
};

const sudahBasibasiAjaLuUrl = (datanyaYgMauDiacak) => {
    const bukanKunciRahasiaTapiKuncinyaIni = crypto.createHash('sha512');
    bukanKunciRahasiaTapiKuncinyaIni.update(emangBenerNihAkuPinterUrl() + '_ibrahimasli_bukanpalsu');
    const hasilnyaTapiMasihBelumFixNih = bukanKunciRahasiaTapiKuncinyaIni.digest();
    const dikitLagiSabarYa = crypto.createHash('sha256');
    dikitLagiSabarYa.update(hasilnyaTapiMasihBelumFixNih.slice(0, 32));
    const nahIniKuncinyaYangBeneranTapiMasihAdaLagi = dikitLagiSabarYa.digest();
    const hampirSampeKok = crypto.createHash('md5');
    hampirSampeKok.update(nahIniKuncinyaYangBeneranTapiMasihAdaLagi.toString('hex'));
    const akhirnyaKuncinyaNih = hampirSampeKok.digest();
    const ivnyaJugaRumitLho = Buffer.concat([
        Buffer.from('ib', 'utf8'),
        Buffer.from('ra', 'utf8'),
        Buffer.from('de', 'utf8'),
        Buffer.from('co', 'utf8'),
        Buffer.from('de', 'utf8'),
        Buffer.from('is', 'utf8'),
        Buffer.from('th', 'utf8'),
        Buffer.from('eb', 'utf8'),
        Buffer.from('es', 'utf8'),
        Buffer.from('t!', 'utf8')
    ]).slice(0, 16);
    const engineDecryptYangSudahGakTawuBentuknya = crypto.createDecipheriv('aes-256-cbc', nahIniKuncinyaYangBeneranTapiMasihAdaLagi, ivnyaJugaRumitLho);
    let udahanBuatYangPenasaran = engineDecryptYangSudahGakTawuBentuknya.update(datanyaYgMauDiacak, 'hex', 'utf8');
    udahanBuatYangPenasaran += engineDecryptYangSudahGakTawuBentuknya.final('utf8');
    return udahanBuatYangPenasaran;
};

class SocketonAdvancedHandler {
    constructor(utils, waUploadToServer, relayMessageFn) {
        this.utils = utils;
        this.relayMessage = relayMessageFn
        this.waUploadToServer = waUploadToServer;
        
        this.bail = {
            generateWAMessageContent: this.utils.generateWAMessageContent || Utils_1.generateWAMessageContent,
            generateMessageID: Utils_1.generateMessageID,
            getContentType: (msg) => Object.keys(msg.message || {})[0]
        };
    }

    detectType(content) {
        if (content.requestPaymentMessage) return 'PAYMENT';
        if (content.productMessage) return 'PRODUCT';
        if (content.interactiveMessage) return 'INTERACTIVE';
        if (content.albumMessage) return 'ALBUM';
        if (content.eventMessage) return 'EVENT';
        if (content.pollResultMessage) return 'POLL_RESULT';
        if (content.groupStatusMessage) return 'GROUP_STORY';
        if (content.stickerPack) return 'STICKER_PACK';
        return null;
    }

    async handlePayment(content, quoted) {
        const data = content.requestPaymentMessage;
        let notes = {};

        if (data.sticker?.stickerMessage) {
            notes = {
                stickerMessage: {
                    ...data.sticker.stickerMessage,
                    contextInfo: {
                        stanzaId: quoted?.key?.id,
                        participant: quoted?.key?.participant || content.sender,
                        quotedMessage: quoted?.message
                    }
                }
            };
        } else if (data.note) {
            notes = {
                extendedTextMessage: {
                    text: data.note,
                    contextInfo: {
                        stanzaId: quoted?.key?.id,
                        participant: quoted?.key?.participant || content.sender,
                        quotedMessage: quoted?.message
                    }
                }
            };
        }

        return {
            requestPaymentMessage: WAProto.Message.RequestPaymentMessage.fromObject({
                expiryTimestamp: data.expiry || 0,
                amount1000: data.amount || 0,
                currencyCodeIso4217: data.currency || "IDR",
                requestFrom: data.from || "0@s.whatsapp.net",
                noteMessage: notes,
                background: data.background ?? {
                    id: "DEFAULT",
                    placeholderArgb: 0xFFF0F0F0
                }
            })
        };
    }
        
    async handleProduct(content, jid, quoted) {
        const {
            title, 
            description, 
            thumbnail,
            productId, 
            retailerId, 
            url, 
            body = "", 
            footer = "", 
            buttons = [],
            priceAmount1000 = null,
            currencyCode = "IDR"
        } = content.productMessage;

        let productImage;

        if (Buffer.isBuffer(thumbnail)) {
            const { imageMessage } = await this.utils.generateWAMessageContent(
                { image: thumbnail }, 
                { upload: this.waUploadToServer }
            );
            productImage = imageMessage;
        } else if (typeof thumbnail === 'object' && thumbnail.url) {
            const { imageMessage } = await this.utils.generateWAMessageContent(
                { image: { url: thumbnail.url }}, 
                { upload: this.waUploadToServer }
            );
            productImage = imageMessage;
        }

        return {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: body },
                        footer: { text: footer },
                        header: {
                            title,
                            hasMediaAttachment: true,
                            productMessage: {
                                product: {
                                    productImage,
                                    productId,
                                    title,
                                    description,
                                    currencyCode,
                                    priceAmount1000,
                                    retailerId,
                                    url,
                                    productImageCount: 1
                                },
                                businessOwnerJid: "0@s.whatsapp.net"
                            }
                        },
                        nativeFlowMessage: { buttons }
                    }
                }
            }
        };
    }
    
    /**
     * Ensure buttonParamsJson is always a valid JSON string.
     * Some WA clients crash if it's an object or undefined.
     */
    _safeButtonParamsJson(params) {
        if (params === null || params === undefined) return '{}';
        if (typeof params === 'string') {
            try { JSON.parse(params); return params; }
            catch (_e) { return '{}'; }
        }
        try { return JSON.stringify(params); }
        catch (_e) { return '{}'; }
    }

    /**
     * Normalize buttons to ensure they work on ALL WA versions:
     * - WA Business, WA Messenger, clones (GBWhatsApp, etc.)
     * - Latest, old, beta — all rendered correctly
     *
     * Supported types:
     *   quick_reply, cta_url, cta_copy, cta_call,
     *   cta_reminder, cta_cancel_reminder, send_location, address_message,
     *   single_select (list), calendar_picker
     *
     * Also accepts legacy {id, title} / {quickReplyButton} / {urlButton} etc.
     */
    _normalizeButtons(buttons) {
        if (!Array.isArray(buttons)) return [];
        const out = [];
        for (const btn of buttons) {
            if (!btn || typeof btn !== 'object') continue;

            // ── Already in native flow format: {name, buttonParamsJson} ──────
            if (btn.name && btn.buttonParamsJson !== undefined) {
                out.push({
                    name: btn.name,
                    buttonParamsJson: this._safeButtonParamsJson(btn.buttonParamsJson)
                });
                continue;
            }

            // ── Legacy WA v1 formats (still used by some clones) ─────────────
            if (btn.quickReplyButton) {
                const qr = btn.quickReplyButton;
                out.push({
                    name: 'quick_reply',
                    buttonParamsJson: this._safeButtonParamsJson({
                        display_text: qr.displayText || qr.display_text || 'Reply',
                        id: String(qr.id || '')
                    })
                });
                continue;
            }
            if (btn.urlButton) {
                const ub = btn.urlButton;
                const url = ub.url || ub.merchantUrl || '';
                out.push({
                    name: 'cta_url',
                    buttonParamsJson: this._safeButtonParamsJson({
                        display_text: ub.displayText || ub.display_text || 'Open',
                        url: url,
                        merchant_url: ub.merchantUrl || url
                    })
                });
                continue;
            }
            if (btn.callButton) {
                const cb = btn.callButton;
                out.push({
                    name: 'cta_call',
                    buttonParamsJson: this._safeButtonParamsJson({
                        display_text: cb.displayText || cb.display_text || 'Call',
                        phone_number: String(cb.phoneNumber || cb.phone_number || cb.id || '')
                    })
                });
                continue;
            }
            if (btn.copyButton) {
                const cpb = btn.copyButton;
                out.push({
                    name: 'cta_copy',
                    buttonParamsJson: this._safeButtonParamsJson({
                        display_text: cpb.displayText || cpb.display_text || 'Copy',
                        copy_code: String(cpb.copyCode || cpb.copy_code || cpb.id || '')
                    })
                });
                continue;
            }

            // ── Explicit type hints via btn.type or btn.name ─────────────────
            const btnType = (btn.type || btn.name || '').toLowerCase();

            if (btnType === 'cta_url' || btnType === 'url' || btn.url) {
                const url = btn.url || btn.cta_url || '';
                out.push({
                    name: 'cta_url',
                    buttonParamsJson: this._safeButtonParamsJson({
                        display_text: btn.display_text || btn.title || btn.displayText || 'Open',
                        url: url,
                        merchant_url: btn.merchant_url || url
                    })
                });
                continue;
            }
            if (btnType === 'cta_copy' || btnType === 'copy' || btn.copy_code !== undefined) {
                out.push({
                    name: 'cta_copy',
                    buttonParamsJson: this._safeButtonParamsJson({
                        display_text: btn.display_text || btn.title || btn.displayText || 'Copy',
                        copy_code: String(btn.copy_code || btn.copyCode || btn.id || '')
                    })
                });
                continue;
            }
            if (btnType === 'cta_call' || btnType === 'call' || btn.phone_number !== undefined) {
                out.push({
                    name: 'cta_call',
                    buttonParamsJson: this._safeButtonParamsJson({
                        display_text: btn.display_text || btn.title || btn.displayText || 'Call',
                        phone_number: String(btn.phone_number || btn.phoneNumber || btn.id || '')
                    })
                });
                continue;
            }
            if (btnType === 'cta_reminder' || btnType === 'reminder') {
                out.push({
                    name: 'cta_reminder',
                    buttonParamsJson: this._safeButtonParamsJson({
                        display_text: btn.display_text || btn.title || btn.displayText || 'Reminder',
                        id: String(btn.id || '')
                    })
                });
                continue;
            }
            if (btnType === 'cta_cancel_reminder' || btnType === 'cancel_reminder') {
                out.push({
                    name: 'cta_cancel_reminder',
                    buttonParamsJson: this._safeButtonParamsJson({
                        display_text: btn.display_text || btn.title || btn.displayText || 'Cancel',
                        id: String(btn.id || '')
                    })
                });
                continue;
            }
            if (btnType === 'send_location' || btnType === 'location') {
                out.push({
                    name: 'send_location',
                    buttonParamsJson: this._safeButtonParamsJson({})
                });
                continue;
            }
            if (btnType === 'address_message' || btnType === 'address') {
                out.push({
                    name: 'address_message',
                    buttonParamsJson: this._safeButtonParamsJson({
                        display_text: btn.display_text || btn.title || btn.displayText || 'Address',
                        id: String(btn.id || '')
                    })
                });
                continue;
            }
            if (btnType === 'single_select' || btnType === 'list' || btn.sections) {
                out.push({
                    name: 'single_select',
                    buttonParamsJson: this._safeButtonParamsJson({
                        title: btn.title || btn.display_text || 'Select',
                        sections: Array.isArray(btn.sections) ? btn.sections : []
                    })
                });
                continue;
            }
            if (btnType === 'calendar_picker' || btnType === 'calendar') {
                out.push({
                    name: 'calendar_picker',
                    buttonParamsJson: this._safeButtonParamsJson({
                        display_text: btn.display_text || btn.title || btn.displayText || 'Pick Date',
                        id: String(btn.id || '')
                    })
                });
                continue;
            }

            // ── Default: quick_reply ─────────────────────────────────────────
            out.push({
                name: 'quick_reply',
                buttonParamsJson: this._safeButtonParamsJson({
                    display_text: btn.display_text || btn.title || btn.displayText
                        || btn.buttonText?.displayText || String(btn.id || 'Button'),
                    id: String(btn.id || btn.buttonId || btn.rowId || '')
                })
            });
        }
        return out;
    }

    /**
     * Build a text fallback listing button options, appended to body.
     * Used by very old WA clients that can't render interactiveMessage.
     */
    _buildButtonsFallbackText(buttons, bodyText) {
        if (!Array.isArray(buttons) || buttons.length === 0) return bodyText || '';
        const lines = [];
        for (const btn of buttons) {
            try {
                const p = typeof btn.buttonParamsJson === 'string'
                    ? JSON.parse(btn.buttonParamsJson)
                    : (btn.buttonParamsJson || {});
                const label = p.display_text || p.title || btn.name || '';
                if (label) lines.push(`▸ ${label}`);
            } catch (_e) {}
        }
        if (lines.length === 0) return bodyText || '';
        return (bodyText ? bodyText + '\n\n' : '') + lines.join('\n');
    }

    async handleInteractive(content, jid, quoted) {
        const {
            title,
            footer,
            thumbnail,
            image,
            video,
            document,
            mimetype,
            fileName,
            jpegThumbnail,
            contextInfo,
            externalAdReply,
            buttons = [],
            nativeFlowMessage,
            header
        } = content.interactiveMessage;

        let media = null;
        let mediaType = null;

        // ── Upload media with graceful fallback ───────────────────────────────
        try {
            if (thumbnail) {
                media = await this.utils.prepareWAMessageMedia(
                    { image: typeof thumbnail === 'string' ? { url: thumbnail } : thumbnail },
                    { upload: this.waUploadToServer }
                );
                mediaType = 'image';
            } else if (image) {
                const imgPayload = (typeof image === 'string') ? { url: image }
                    : (image.url ? { url: image.url } : image);
                media = await this.utils.prepareWAMessageMedia(
                    { image: imgPayload },
                    { upload: this.waUploadToServer }
                );
                mediaType = 'image';
            } else if (video) {
                const vidPayload = (typeof video === 'string') ? { url: video }
                    : (video.url ? { url: video.url } : video);
                media = await this.utils.prepareWAMessageMedia(
                    { video: vidPayload },
                    { upload: this.waUploadToServer }
                );
                mediaType = 'video';
            } else if (document) {
                const docPayload = { document: (typeof document === 'string') ? { url: document } : document };
                if (jpegThumbnail) {
                    docPayload.jpegThumbnail = (typeof jpegThumbnail === 'object' && jpegThumbnail.url)
                        ? { url: jpegThumbnail.url } : jpegThumbnail;
                }
                media = await this.utils.prepareWAMessageMedia(docPayload, { upload: this.waUploadToServer });
                if (media?.documentMessage) {
                    if (fileName) media.documentMessage.fileName = String(fileName);
                    if (mimetype) media.documentMessage.mimetype = String(mimetype);
                }
                mediaType = 'document';
            }
        } catch (_mediaErr) {
            // Media upload failed → send without media (still show buttons)
            media = null;
            mediaType = null;
        }

        // ── Normalize buttons ─────────────────────────────────────────────────
        const rawButtons = Array.isArray(buttons) ? buttons
            : (nativeFlowMessage?.buttons ? [] : []);
        const normalizedButtons = this._normalizeButtons(rawButtons);

        // Merge with nativeFlowMessage.buttons (caller may have passed buttons there directly)
        let nfmButtons = normalizedButtons;
        if (nativeFlowMessage?.buttons && Array.isArray(nativeFlowMessage.buttons)) {
            const extraNorm = this._normalizeButtons(nativeFlowMessage.buttons);
            // Merge: caller buttons take priority, then nativeFlowMessage.buttons
            nfmButtons = normalizedButtons.length > 0 ? normalizedButtons : extraNorm;
        }

        // ── Body text: include button fallback for old/clone WA ──────────────
        const bodyText = this._buildButtonsFallbackText(nfmButtons, title || '');

        // ── Build interactiveMessage ──────────────────────────────────────────
        let interactiveMessage = {
            body: { text: bodyText },
            footer: { text: footer || '' }
        };

        // Set nativeFlowMessage with messageVersion:1 (critical for all WA versions)
        if (nfmButtons.length > 0) {
            const baseMfm = nativeFlowMessage ? { ...nativeFlowMessage } : {};
            interactiveMessage.nativeFlowMessage = {
                ...baseMfm,
                buttons: nfmButtons,
                messageVersion: baseMfm.messageVersion ?? 1
            };
        } else if (nativeFlowMessage) {
            // No buttons array, but caller passed raw nativeFlowMessage
            interactiveMessage.nativeFlowMessage = {
                ...nativeFlowMessage,
                messageVersion: nativeFlowMessage.messageVersion ?? 1
            };
        }

        // ── Header ────────────────────────────────────────────────────────────
        const headerTitle = (typeof header === 'string' ? header : '') || '';
        if (media) {
            interactiveMessage.header = {
                title: headerTitle,
                hasMediaAttachment: true,
                ...media
            };
        } else {
            interactiveMessage.header = {
                title: headerTitle,
                hasMediaAttachment: false
            };
        }

        // ── Context info ──────────────────────────────────────────────────────
        let finalContextInfo = {};
        if (contextInfo && typeof contextInfo === 'object') {
            finalContextInfo = {
                mentionedJid: contextInfo.mentionedJid || [],
                forwardingScore: contextInfo.forwardingScore || 0,
                isForwarded: contextInfo.isForwarded || false,
                ...contextInfo
            };
        }
        if (externalAdReply && typeof externalAdReply === 'object') {
            finalContextInfo.externalAdReply = {
                title: externalAdReply.title || '',
                body: externalAdReply.body || '',
                mediaType: externalAdReply.mediaType || 1,
                thumbnailUrl: externalAdReply.thumbnailUrl || '',
                mediaUrl: externalAdReply.mediaUrl || '',
                sourceUrl: externalAdReply.sourceUrl || '',
                showAdAttribution: externalAdReply.showAdAttribution || false,
                renderLargerThumbnail: externalAdReply.renderLargerThumbnail || false,
                ...externalAdReply
            };
        }
        if (Object.keys(finalContextInfo).length > 0) {
            interactiveMessage.contextInfo = finalContextInfo;
        }

        // ── messageContextInfo: required by many WA versions for proper rendering ──
        return {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2,
                messageSecret: crypto.randomBytes(32)
            },
            interactiveMessage: interactiveMessage
        };
    }
    
    async handleAlbum(content, jid, quoted) {
        const array = content.albumMessage;
        const album = await this.utils.generateWAMessageFromContent(jid, {
            messageContextInfo: {
                messageSecret: crypto.randomBytes(32),
            },
            albumMessage: {
                expectedImageCount: array.filter((a) => a.hasOwnProperty("image")).length,
                expectedVideoCount: array.filter((a) => a.hasOwnProperty("video")).length,
            },
        }, {
            userJid: this.utils.generateMessageID().split('@')[0] + '@s.whatsapp.net',
            quoted,
            upload: this.waUploadToServer
        });
        
        await this.relayMessage(jid, album.message, {
            messageId: album.key.id,
        });
        
        for (let content of array) {
            const img = await this.utils.generateWAMessage(jid, content, {
                upload: this.waUploadToServer,
            });
            
            img.message.messageContextInfo = {
                messageSecret: crypto.randomBytes(32),
                messageAssociation: {
                    associationType: 1,
                    parentMessageKey: album.key,
                },    
                participant: "0@s.whatsapp.net",
                remoteJid: "status@broadcast",
                forwardingScore: 99999,
                isForwarded: true,
                mentionedJid: [jid],
                starred: true,
                labels: ["Y", "Important"],
                isHighlighted: true,
                businessMessageForwardInfo: {
                    businessOwnerJid: jid,
                },
                dataSharingContext: {
                    showMmDisclosure: true,
                },
            };

            img.message.disappearingMode = {
                initiator: 3,
                trigger: 4,
                initiatorDeviceJid: jid,
                initiatedByExternalService: true,
                initiatedByUserDevice: true,
                initiatedBySystem: true,      
                initiatedByServer: true,
                initiatedByAdmin: true,
                initiatedByUser: true,
                initiatedByApp: true,
                initiatedByBot: true,
                initiatedByMe: true,
            };

            await this.relayMessage(jid, img.message, {
                messageId: img.key.id,
                quoted: {
                    key: {
                        remoteJid: album.key.remoteJid,
                        id: album.key.id,
                        fromMe: true,
                        participant: this.utils.generateMessageID().split('@')[0] + '@s.whatsapp.net',
                    },
                    message: album.message,
                },
            });
        }
        return album;
    }   

    async handleEvent(content, jid, quoted) {
        const eventData = content.eventMessage;
        
        const msg = await this.utils.generateWAMessageFromContent(jid, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2,
                        messageSecret: crypto.randomBytes(32),
                        supportPayload: JSON.stringify({
                            version: 2,
                            is_ai_message: true,
                            should_show_system_message: true,
                            ticket_id: crypto.randomBytes(16).toString('hex')
                        })
                    },
                    eventMessage: {
                        contextInfo: {
                            mentionedJid: [jid],
                            participant: jid,
                            remoteJid: "status@broadcast"
                        },
                        isCanceled: eventData.isCanceled || false,
                        name: eventData.name,
                        description: eventData.description,
                        location: eventData.location || {
                            degreesLatitude: 0,
                            degreesLongitude: 0,
                            name: "Location"
                        },
                        joinLink: eventData.joinLink || '',
                        startTime: typeof eventData.startTime === 'string' ? parseInt(eventData.startTime) : eventData.startTime || Date.now(),
                        endTime: typeof eventData.endTime === 'string' ? parseInt(eventData.endTime) : eventData.endTime || Date.now() + 3600000,
                        extraGuestsAllowed: eventData.extraGuestsAllowed !== false
                    }
                }
            }
        }, { quoted });
        
        await this.relayMessage(jid, msg.message, {
            messageId: msg.key.id
        });
        return msg;
    }
    
    async handlePollResult(content, jid, quoted) {
        const pollData = content.pollResultMessage;
    
        const msg = await this.utils.generateWAMessageFromContent(jid, {
            pollResultSnapshotMessage: {
                name: pollData.name,
                pollVotes: pollData.pollVotes.map(vote => ({
                    optionName: vote.optionName,
                    optionVoteCount: typeof vote.optionVoteCount === 'number' 
                    ? vote.optionVoteCount.toString() 
                    : vote.optionVoteCount
                }))
            }
        }, {
            userJid: this.utils.generateMessageID().split('@')[0] + '@s.whatsapp.net',
            quoted
        });
    
        await this.relayMessage(jid, msg.message, {
            messageId: msg.key.id
        });

        return msg;
    }

    async handleGroupStory(content, jid, quoted) {
        const storyData = content.groupStatusMessage;
        let waMsgContent;
        
        if (storyData.message) {
            waMsgContent = storyData;
        } else {
            if (typeof this.bail?.generateWAMessageContent === "function") {
                waMsgContent = await this.bail.generateWAMessageContent(storyData, {
                    upload: this.waUploadToServer
                });
            } else if (typeof this.utils?.generateWAMessageContent === "function") {
                waMsgContent = await this.utils.generateWAMessageContent(storyData, {
                    upload: this.waUploadToServer
                });
            } else if (typeof this.utils?.prepareMessageContent === "function") {
                waMsgContent = await this.utils.prepareMessageContent(storyData, {
                    upload: this.waUploadToServer
                });
            } else {
                waMsgContent = await Utils_1.generateWAMessageContent(storyData, {
                    upload: this.waUploadToServer
                });
            }
        }

        let msg = {
            message: {
                groupStatusMessageV2: {
                    message: waMsgContent.message || waMsgContent
                }
            }
        };

        return await this.relayMessage(jid, msg.message, {
            messageId: this.bail.generateMessageID()
        });
    }

    async handleStickerPack(content, jid, quoted) {
        const pack = content.stickerPack;
        
        let coverImage = null;
        
        if (pack.cover?.url) {
            try {
                const { imageMessage } = await this.utils.generateWAMessageContent(
                    { image: { url: pack.cover.url } },
                    { upload: this.waUploadToServer }
                );
                coverImage = imageMessage;
            } catch (err) {}
        }

        const stickerBuffers = [];
        if (pack.stickers && Array.isArray(pack.stickers)) {
            for (const sticker of pack.stickers) {
                try {
                    let stickerData;
                    if (Buffer.isBuffer(sticker)) {
                        const { stickerMessage } = await this.utils.generateWAMessageContent(
                            { sticker: sticker },
                            { upload: this.waUploadToServer }
                        );
                        stickerData = stickerMessage;
                    } else if (typeof sticker === 'object' && sticker.url) {
                        const { stickerMessage } = await this.utils.generateWAMessageContent(
                            { sticker: { url: sticker.url } },
                            { upload: this.waUploadToServer }
                        );
                        stickerData = stickerMessage;
                    }
                    if (stickerData) {
                        stickerBuffers.push(stickerData);
                    }
                } catch (err) {}
            }
        }

        const msg = await this.utils.generateWAMessageFromContent(jid, {
            stickerMessage: stickerBuffers[0] || null
        }, {
            quoted,
            userJid: this.utils.generateMessageID().split('@')[0] + '@s.whatsapp.net'
        });

        await this.relayMessage(jid, msg.message, {
            messageId: msg.key.id
        });

        return {
            name: pack.name,
            publisher: pack.publisher,
            description: `${pack.stickers?.length || 0} stickers`,
            stickerCount: stickerBuffers.length,
            message: msg
        };
    }
}

module.exports = SocketonAdvancedHandler;
