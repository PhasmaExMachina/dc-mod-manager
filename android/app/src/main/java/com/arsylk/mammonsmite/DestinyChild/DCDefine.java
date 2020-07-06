package com.arsylk.mammonsmite.DestinyChild;

import java.util.regex.Pattern;

public final class DCDefine {
    //first 8 bytes in pck files
    public static final byte[]
            PCK_IDENTIFIER = new byte[] {(byte)0x50, (byte)0x43, (byte)0x4B, (byte)0x00, (byte)0xCD, (byte)0xCC, (byte)0xCC, (byte)0x3E};

    //first 4 bytes in hash
    public static final byte[]
            HASH_MODEL_OR_TEXTURE = new byte[] {(byte)0x66, (byte)0x0E, (byte)0x00, (byte)0x26},
            HASH_CHARACTER = new byte[] {(byte)0x05, (byte)0x0E, (byte)0x00, (byte)0x25},
            HASH_IDLE = new byte[] {(byte)0x28, (byte)0x0F, (byte)0x00, (byte)0x28},
            HASH_ATTACK = new byte[] {(byte)0xEA, (byte)0x0F, (byte)0x00, (byte)0x2A};
    public static final byte[]
            HASH_LOCALE_MODELIDS = new byte[] {(byte)0x30, (byte)0x0f, (byte)0x00, (byte)0x24};

    //extensions
    public static final int UNKNOWN = 0, DAT = 1, MTN = 2, PNG = 3, JSON = 4, LOCALE_DEF = 12, LOCALE_TAB = 11;

    //patterns
    public static final Pattern LOCALE_DEF_LINE_PATTERN = Pattern.compile("^(?!/)(\\S+)\\s*?=\\s*?\"(.*?)\"\\s*?$");
    public static final Pattern LOCALE_TAB_LINE_PATTERN = Pattern.compile("^(?!/)(\\S+)\\s(.*?)$");
    public static final Pattern MODEL_ID_PATTERN = Pattern.compile("^.*\\d{3}_\\d{2}$");
}
