package com.hejagam.utils;

import com.google.android.gms.ads.AdSize;

public class AdSizeUtil {
    public static AdSize getAdSizeFromString(String adSize) {
        if (adSize.contains("x")) {
            String[] splitAdSizes = adSize.split("x");
            if (splitAdSizes.length == 2) {
                double width = Double.parseDouble(splitAdSizes[0]);
                double height = Double.parseDouble(splitAdSizes[1]);

                int roundedWidth = (int) Math.floor(width);
                int roundedHeight = (int) Math.floor(height);

                return new AdSize(roundedWidth, roundedHeight);
            }
        }

        switch (adSize) {
            case "fullBanner":
                return AdSize.FULL_BANNER;
            case "largeBanner":
                return AdSize.LARGE_BANNER;
            case "fluid":
                return AdSize.FLUID;
            case "skyscraper":
                return AdSize.WIDE_SKYSCRAPER;
            case "leaderBoard":
                return AdSize.LEADERBOARD;
            case "mediumRectangle":
                return AdSize.MEDIUM_RECTANGLE;
            case "banner":
            default:
                return AdSize.BANNER;
        }
    }
}